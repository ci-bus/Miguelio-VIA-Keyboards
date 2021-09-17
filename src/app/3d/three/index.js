import SceneManager from "./sceneManager";
import CaseManager from "./case/caseManager";
import KeyManager from "./key/keyManager";

const SCREEN_SCALE = 50;
let ThreeApp, KEYS, CASE;


export default (element, action, opts) => {

    switch (action) {
        case 'init':
            // Main three js script
            ThreeApp = new SceneManager({
                ...opts,
                scale: SCREEN_SCALE,
                el: element
            });

            KEYS = new KeyManager({
                ...opts,
                scene: ThreeApp.scene,
                el: element
            });

            CASE = new CaseManager({
                scene: ThreeApp.scene,
            });

            ThreeApp.add(KEYS);
            ThreeApp.tick();
            break;
        case 'updateKeys':
            KEYS.updateKeys(opts);
        break;
        default:
            console.log('Unknow action', action);
        break;
    }
};
