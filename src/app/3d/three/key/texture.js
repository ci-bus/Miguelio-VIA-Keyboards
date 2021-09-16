import * as THREE from "three";
import LEGENDS from "../../config/legends/primary/primary";
import SUBS from "../../config/legends/subs/subs";
import KeyUtil from "../../util/keyboard";

const MIP_COUNT = 0;

//genertates a texture with canvas for top of key
export const keyTexture = (opts) => {
    let w = opts.w;
    let h = opts.h;
    let legend = opts.legend;
    let sublegend = "arabic";
    let key = opts.key;
    let code = opts.code;
    var texture;
    let pxPerU = 128;
    let subColor = opts.subColor || opts.color;
    let fg = opts.color;
    let bg = opts.background;

    //iso enter add extra .25 for overhang
    let isIsoEnter = opts.isIsoEnt;
    if (isIsoEnter) {
        w = w + 0.25;
    }

    let canvas = document.createElement("canvas");
    canvas.height = pxPerU * h;
    canvas.width = pxPerU * w;

    //let canvas = new OffscreenCanvas(pxPerU * w, pxPerU * h);

    let ctx = canvas.getContext("2d");
    //draw base color
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw gradient to simulate sculpting
    let gradient;
    if (code === "KC_SPC") {
        //convex
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(0,0,0,0.15)");
        gradient.addColorStop(0.5, "rgba(128,128,128,0.0)");
        gradient.addColorStop(1, "rgba(255,255,255,0.15)");
    } else {
        //concave
        //simulate slight curve with gradient on face
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "rgba(255,255,255,0.2)");
        gradient.addColorStop(0.4, "rgba(255,255,255,0.0)");
        gradient.addColorStop(0.6, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.15)");
    }

    //bottom edge highlight
    let shineOpacity = 0.4;
    let shineRight = ctx.createLinearGradient(0, 0, canvas.width, 0);
    shineRight.addColorStop(0, `rgba(255,255,255,${0 * shineOpacity})`);
    shineRight.addColorStop(0.03, `rgba(255,255,255,${0 * shineOpacity})`);
    shineRight.addColorStop(0.07, `rgba(255,255,255,${0.6 * shineOpacity})`);
    shineRight.addColorStop(0.8, `rgba(255,255,255,${0.6 * shineOpacity})`);
    shineRight.addColorStop(0.95, `rgba(255,255,255,${0 * shineOpacity})`);

    //side edge highlight
    let shineBottom = ctx.createLinearGradient(0, 0, 0, canvas.height);
    let highlightRatio = (canvas.width - pxPerU * 0.04) / canvas.width;
    shineBottom.addColorStop(0, `rgba(255,255,255,${0 * shineOpacity})`);
    shineBottom.addColorStop(0.03, `rgba(255,255,255,${0 * shineOpacity})`);
    shineBottom.addColorStop(0.15, `rgba(255,255,255,${0.5 * shineOpacity})`);
    shineBottom.addColorStop(0.5, `rgba(255,255,255,${0.7 * shineOpacity})`);
    shineBottom.addColorStop(0.85, `rgba(255,255,255,${1.1 * shineOpacity})`);
    shineBottom.addColorStop(0.9, `rgba(255,255,255,${0.7 * shineOpacity})`);
    shineBottom.addColorStop(0.95, `rgba(255,255,255,${0 * shineOpacity})`);
    shineBottom.addColorStop(1, `rgba(255,255,255,${0 * shineOpacity})`);

    //draw gradients
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = shineRight;
    ctx.fillRect(0, canvas.height * 0.97, canvas.width, canvas.height);

    ctx.fillStyle = shineBottom;
    ctx.fillRect(canvas.width * highlightRatio, 0, canvas.width, canvas.height);

    let l = LEGENDS[legend];
    l.yOffsetBottom = 85;

    // Serigraphy
    let mainChar = {
        top: key.serigraphy,
        bottom: ''
    };

    if (key.serigraphy.lastIndexOf(' ') > 0) {
        mainChar = {
            top: key.serigraphy.substring(0, key.serigraphy.lastIndexOf(' ')),
            bottom: key.serigraphy.substring(key.serigraphy.lastIndexOf(' ') + 1, key.serigraphy.length)
        };
    } else if (mainChar.top.lastIndexOf('(') > 0) {
        mainChar = {
            top: key.serigraphy.substring(0, key.serigraphy.lastIndexOf('(')),
            bottom: key.serigraphy.substring(key.serigraphy.lastIndexOf('('), key.serigraphy.length)
        };
    }


    let modWord = !l.encoded && mainChar.length > 1; //mods use multi chacter words instead of symbols (sa)
    let subChar = SUBS[sublegend].chars[code] || "";

    //font size
    let proportion = 2.5 * key.u / mainChar["top"].replace(' ', '').length;
    if (proportion > 1) proportion = 1;
    let fontSize = (mainChar["bottom"] ? 50 : 60) * proportion;

    //set font style
    if (modWord) {
        ctx.font = `700 ${fontSize}px ${l.fontFamily}`;
    } else {
        ctx.font = `${fontSize}px ${l.fontFamily}`;
    }
    ctx.fillStyle = fg;

    ctx.textAlign = "left";
    let ent_off_x = 0;
    let ent_off_y = 0;
    if (isIsoEnter) {
        ent_off_x = 15;
        ent_off_y = 6;
    }

    if (mainChar["top"]) {
        ctx.fillText(mainChar.top, l.offsetX, l.offsetY + l.yOffsetTop);
        ctx.fillText(mainChar.bottom, l.offsetX, l.offsetY + l.yOffsetBottom);
    } else {
        ctx.fillText(
            mainChar,
            l.offsetX + ent_off_x,
            l.fontsize + (KeyUtil.isAlpha(key) ? l.offsetY : l.yOffsetMod) + ent_off_y
        );
    }

    // //sub characters
    if (sublegend && subChar && l.subsSupported) {
        let sub = SUBS[sublegend];
        let multiplier = sub.fontSizeMultiplier * 0.35;
        ctx.fillStyle = subColor || fg;
        ctx.font = `bold ${pxPerU * multiplier}px ${sub.fontFamily}`;
        if (subChar.top) {
            ctx.fillText(subChar.top, pxPerU * 0.55, pxPerU * 0.4);
            ctx.fillText(subChar.bottom, pxPerU * 0.55, pxPerU * 0.8);
        } else {
            ctx.fillText(subChar, pxPerU * 0.55, pxPerU * 0.8);
        }
    }

    texture = new THREE.CanvasTexture(canvas);

    if (MIP_COUNT > 0) {
        // texture.mipmaps[0] = canvas;
        // for (let i = 1; i < MIP_COUNT + 1; i++) {
        //   let scale = 1 / 2 ** i;
        //   let mip_w = opts.w * pxPerU * scale;
        //   let mip_h = opts.h * pxPerU * scale;
        //   let mip_canvas = document.createElement("canvas");
        //   let mip_ctx = mip_canvas.getContext("2d");
        //   mip_canvas.width = mip_w;
        //   mip_canvas.height = mip_h;
        //   mip_ctx.fillStyle = "#ff0000";
        //   mip_ctx.fillRect(0, 0, mip_w, mip_h);
        //   // mip_ctx.scale(scale, scale);
        //   // mip_ctx.drawImage(canvas, 0, 0);
        //   texture.mipmaps[i] = mip_canvas;
        //   if (DEBUG) {
        //     document.body.appendChild(mip_canvas);
        //   }
        // }
    }

    //document.body.appendChild(canvas);

    texture.needsUpdate = true;
    texture.minFilter = THREE.NearestMipmapNearestFilter;
    return texture;
};
