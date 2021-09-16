import SceneManager from "./sceneManager";
import CaseManager from "./case/caseManager";
import KeyManager from "./key/keyManager";

const SCREEN_SCALE = 50;

export default (element, opts) => {
    //MAIN THREE JS SETUP
    //-------------------------------------
    const ThreeApp = new SceneManager({
        scale: SCREEN_SCALE,
        el: element
    });

    const KEYS = new KeyManager({
        ...opts,
        scene: ThreeApp.scene
    });

    new CaseManager({
        scene: ThreeApp.scene,
    });

    //start render loop
    ThreeApp.add(KEYS);
    ThreeApp.tick();
};
