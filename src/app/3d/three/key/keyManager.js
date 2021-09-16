import * as THREE from "three";
import Util from "../../util/math";
import KeyUtil from "../../util/keyboard";
import ColorUtil from "../../util/color";
import LAYOUTS from "../../config/layouts/layouts";
import { Key, KEYSTATES } from "./key";
import Collection from "../collection";

export default class KeyManager extends Collection {
    constructor(opts) {
        super(opts);
        this.height = 1.1;
        this.angle = 6;
        this.setup(opts);
    }

    setup(opts) {
        this.group = new THREE.Object3D();
        this.group.name = "KEYS";
        this.editing = false;
        this.paintWithKeys = false;
        this.getLayout(opts.layout);
        this.getKeymap(opts.keymap);
        this.createKeys();
        this.bindPressedEvents();
        this.bindPaintEvent();
        this.position();
        this.scene.add(this.group);
        /*
            subscribe("case.layout", (state) => {
              this.getLayout(state.case.layout);
              this.getKeymap(state.case.layout);
              this.createKeys();
              this.position();
            });
            subscribe("colorways.editing", (state) => {
              this.editing = state.colorways.editing;
            });
            subscribe("settings.paintWithKeys", (state) => {
              this.paintWithKeys = state.settings.paintWithKeys;
            });
            */
    }

    get width() {
        return this.layoutFull.width;
    }
    get depth() {
        return this.layoutFull.height;
    }
    get angleOffset() {
        return Math.sin(Util.toRad(this.angle)) * this.depth;
    }

    position() {
        this.group.rotation.x = Util.toRad(this.angle);
        this.group.position.x = -this.layoutFull.width / 2;
        this.group.position.y = this.angleOffset + this.height;
    }

    getKeymap(keymap) {
        this.keymap = keymap;
    }

    getLayout(layout) {
        this.layoutFull = LAYOUTS["65"];
        this.layout = layout;
    }

    bindPressedEvents() {
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let code = KeyUtil.getKeyCode(e.code);
            let key = this.getKey(code);
            if (!key) return;
            if (this.editing && this.paintWithKeys) {
                this.paintKey(code);
            }
            key.setState(KEYSTATES.MOVING_DOWN);
        });
        document.addEventListener("keyup", (e) => {
            let code = KeyUtil.getKeyCode(e.code);
            let key = this.getKey(code);
            if (!key) return;
            key.setState(KEYSTATES.MOVING_UP);
        });
    }

    bindPaintEvent() {
        document.addEventListener("key_painted", (e) => {
            this.paintKey(e.detail);
        });
    }

    paintKey(code) {
        ColorUtil.addCodeToOverride(code);
        this.getKey(code).updateColors();
    }

    removeKey(key) {
        key.destroy();
        this.remove(key);
    }

    removeAllOldKeys() {
        this.components = this.components.filter((x) => {
            let keep = this.keymap.includes(x.code);
            if (!keep) x.destroy();
            return keep;
        });
    }

    createKeys() {
        let seen = []; //for boards with multiple keys of same code
        this.removeAllOldKeys();
        for (let i = 0; i < this.layout.length; i++) {
            let key = this.keymap[i];
            let dimensions = this.layout[i];
            dimensions.row = KeyUtil.getKeyProfile(
                i,
                this.layout,
                this.layoutFull.height
            );
            let existingKey = this.getKey(key.code);
            if (existingKey && !seen.includes(key.code)) {
                if (this.matchesSize(existingKey, dimensions)) {
                    existingKey.move(dimensions);
                    seen.push(key.code);
                    continue;
                }
                this.removeKey(existingKey);
            }
            let K = new Key({
                key,
                dimensions,
                container: this.group,
                isIso: this.layoutFull.is_iso,
                colorway: this.colorway
            });
            this.add(K);
            seen.push(key.code);
        }
    }

    getKey(code) {
        let k = this.components.find((x) => x.key.code === code);
        return k;
    }

    matchesSize(k, dimensions) {
        let hmatch = (k.options.dimensions.h || 1) === (dimensions.h || 1);
        let wmatch = (k.options.dimensions.w || 1) === (dimensions.w || 1);
        return hmatch && wmatch;
    }
}
