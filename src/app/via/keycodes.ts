let keycodes = [];
keycodes[0] = [
    'KC_NO', 'KC_TRNS', 'KC_POST_FAIL', 'KC_UNDEFINED',
    'KC_A',
    'KC_B',
    'KC_C',
    'KC_D',
    'KC_E',
    'KC_F',
    'KC_G',
    'KC_H',
    'KC_I',
    'KC_J',
    'KC_K',
    'KC_L',
    'KC_M',  // 0x10
    'KC_N',
    'KC_O',
    'KC_P',
    'KC_Q',
    'KC_R',
    'KC_S',
    'KC_T',
    'KC_U',
    'KC_V',
    'KC_W',
    'KC_X',
    'KC_Y',
    'KC_Z',
    'KC_1',
    'KC_2',
    'KC_3',  // 0x20
    'KC_4',
    'KC_5',
    'KC_6',
    'KC_7',
    'KC_8',
    'KC_9',
    'KC_0',
    'KC_ENTER',
    'KC_ESCAPE',
    'KC_BSPACE',
    'KC_TAB',
    'KC_SPACE',
    'KC_MINUS',
    'KC_EQUAL',
    'KC_LBRACKET',
    'KC_RBRACKET',  // 0x30
    'KC_BSLASH',
    'KC_NONUS_HASH',
    'KC_SCOLON',
    'KC_QUOTE',
    'KC_GRAVE',
    'KC_COMMA',
    'KC_DOT',
    'KC_SLASH',
    'KC_CAPSLOCK',
    'KC_F1',
    'KC_F2',
    'KC_F3',
    'KC_F4',
    'KC_F5',
    'KC_F6',
    'KC_F7',  // 0x40
    'KC_F8',
    'KC_F9',
    'KC_F10',
    'KC_F11',
    'KC_F12',
    'KC_PSCREEN',
    'KC_SCROLLLOCK',
    'KC_PAUSE',
    'KC_INSERT',
    'KC_HOME',
    'KC_PGUP',
    'KC_DELETE',
    'KC_END',
    'KC_PGDOWN',
    'KC_RIGHT',
    'KC_LEFT',  // 0x50
    'KC_DOWN',
    'KC_UP',
    'KC_NUMLOCK',
    'KC_KP_SLASH',
    'KC_KP_ASTERISK',
    'KC_KP_MINUS',
    'KC_KP_PLUS',
    'KC_KP_ENTER',
    'KC_KP_1',
    'KC_KP_2',
    'KC_KP_3',
    'KC_KP_4',
    'KC_KP_5',
    'KC_KP_6',
    'KC_KP_7',
    'KC_KP_8',  // 0x60
    'KC_KP_9',
    'KC_KP_0',
    'KC_KP_DOT',
    'KC_NONUS_BSLASH',
    'KC_APPLICATION',
    'KC_POWER',
    'KC_KP_EQUAL',
    'KC_F13',
    'KC_F14',
    'KC_F15',
    'KC_F16',
    'KC_F17',
    'KC_F18',
    'KC_F19',
    'KC_F20',
    'KC_F21',  // 0x70
    'KC_F22',
    'KC_F23',
    'KC_F24',
    'KC_EXECUTE',
    'KC_HELP',
    'KC_MENU',
    'KC_SELECT',
    'KC_STOP',
    'KC_AGAIN',
    'KC_UNDO',
    'KC_CUT',
    'KC_COPY',
    'KC_PASTE',
    'KC_FIND',
    'KC__MUTE',
    'KC__VOLUP',  // 0x80
    'KC__VOLDOWN',
    'KC_LOCKING_CAPS',
    'KC_LOCKING_NUM',
    'KC_LOCKING_SCROLL',
    'KC_KP_COMMA',
    'KC_KP_EQUAL_AS400',
    'KC_INT1',
    'KC_INT2',
    'KC_INT3',
    'KC_INT4',
    'KC_INT5',
    'KC_INT6',
    'KC_INT7',
    'KC_INT8',
    'KC_INT9',
    'KC_LANG1',  // 0x90
    'KC_LANG2',
    'KC_LANG3',
    'KC_LANG4',
    'KC_LANG5',
    'KC_LANG6',
    'KC_LANG7',
    'KC_LANG8',
    'KC_LANG9',
    'KC_ALT_ERASE',
    'KC_SYSREQ',
    'KC_CANCEL',
    'KC_CLEAR',
    'KC_PRIOR',
    'KC_RETURN',
    'KC_SEPARATOR',
    'KC_OUT',  // 0xA0
    'KC_OPER',
    'KC_CLEAR_AGAIN',
    'KC_CRSEL',
    'KC_EXSEL',
    'KC_SYSTEM_POWER',
    'KC_SYSTEM_SLEEP',
    'KC_SYSTEM_WAKE',
    'KC_AUDIO_MUTE',
    'KC_AUDIO_VOL_UP',
    'KC_AUDIO_VOL_DOWN',
    'KC_MEDIA_NEXT_TRACK',
    'KC_MEDIA_PREV_TRACK',
    'KC_MEDIA_STOP',
    'KC_MEDIA_PLAY_PAUSE',
    'KC_MEDIA_SELECT',
    'KC_MEDIA_EJECT',
    'KC_MAIL',
    'KC_CALCULATOR',
    'KC_MY_COMPUTER',
    'KC_WWW_SEARCH',
    'KC_WWW_HOME',
    'KC_WWW_BACK',
    'KC_WWW_FORWARD',
    'KC_WWW_STOP',
    'KC_WWW_REFRESH',
    'KC_WWW_FAVORITES',
    'KC_MEDIA_FAST_FORWARD',
    'KC_MEDIA_REWIND',
    'KC_BRIGHTNESS_UP',
    'KC_BRIGHTNESS_DOWN',
    '',
    'KC_FN0',
    'KC_FN1',
    'KC_FN2',
    'KC_FN3',
    'KC_FN4',
    'KC_FN5',
    'KC_FN6',
    'KC_FN7',
    'KC_FN8',
    'KC_FN9',
    'KC_FN10',
    'KC_FN11',
    'KC_FN12',
    'KC_FN13',
    'KC_FN14',
    'KC_FN15',
    'KC_FN16',
    'KC_FN17',
    'KC_FN18',
    'KC_FN19',
    'KC_FN20',
    'KC_FN21',
    'KC_FN22',
    'KC_FN23',
    'KC_FN24',
    'KC_FN25',
    'KC_FN26',
    'KC_FN27',
    'KC_FN28',
    'KC_FN29',
    'KC_FN30',
    'KC_FN31',
    'KC_LCTRL',
    'KC_LSHIFT',
    'KC_LALT',
    'KC_LGUI',
    'KC_RCTRL',
    'KC_RSHIFT',
    'KC_RALT',
    'KC_RGUI',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'KC_MS_UP',
    'KC_MS_DOWN',
    'KC_MS_LEFT',
    'KC_MS_RIGHT',
    'KC_MS_BTN1',
    'KC_MS_BTN2',
    'KC_MS_BTN3',
    'KC_MS_BTN4',
    'KC_MS_BTN5',
    'KC_MS_WH_UP',
    'KC_MS_WH_DOWN',
    'KC_MS_WH_LEFT',
    'KC_MS_WH_RIGHT',
    'KC_MS_ACCEL0',
    'KC_MS_ACCEL1',
    'KC_MS_ACCEL2'
];

// Special keys quantum and lights
keycodes[92] = ['RESET', 'DEBUG', 'MAGIC_SWAP_CONTROL_CAPSLOCK', 'MAGIC_CAPSLOCK_TO_CONTROL', 'MAGIC_SWAP_LALT_LGUI', 'MAGIC_SWAP_RALT_RGUI', 'MAGIC_NO_GUI', 'MAGIC_SWAP_GRAVE_ESC', 'MAGIC_SWAP_BACKSLASH_BACKSPACE', 'MAGIC_HOST_NKRO', 'MAGIC_SWAP_ALT_GUI', 'MAGIC_UNSWAP_CONTROL_CAPSLOCK', 'MAGIC_UNCAPSLOCK_TO_CONTROL', 'MAGIC_UNSWAP_LALT_LGUI', 'MAGIC_UNSWAP_RALT_RGUI', 'MAGIC_UNNO_GUI', 'MAGIC_UNSWAP_GRAVE_ESC', 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE', 'MAGIC_UNHOST_NKRO', 'MAGIC_UNSWAP_ALT_GUI', 'MAGIC_TOGGLE_NKRO', 'MAGIC_TOGGLE_ALT_GUI', 'GRAVE_ESC'];
keycodes[92].length = 187; // Jump
keycodes[92].push.apply(keycodes[92], [
    'BL_ON', 'BL_OFF', 'BL_DEC', 'BL_INC', 'BL_TOGG', 'BL_STEP', 'BL_BRTG',
    'RGB_TOG', 'RGB_MODE_FORWARD', 'RGB_MODE_REVERSE', 'RGB_HUI', 'RGB_HUD', 'RGB_SAI', 'RGB_SAD',
    'RGB_VAI', 'RGB_VAD', 'RGB_SPI', 'RGB_SPD', 'RGB_MODE_PLAIN', 'RGB_MODE_BREATHE', 'RGB_MODE_RAINBOW',
    'RGB_MODE_SWIRL', 'RGB_MODE_SNAKE', 'RGB_MODE_KNIGHT', 'RGB_MODE_XMAS', 'RGB_MODE_GRADIENT', 'RGB_MODE_RGBTEST',
    //??? 'VLK_TOG', 'KC_LSPO', 'KC_RSPC', 'KC_SFTENT', 'PRINT_ON', 'PRINT_OFF', 'OUT_AUTO', 'OUT_USB'
]);

// Special keys FN
keycodes[81] = ['MO(0)', 'MO(1)', 'MO(2)', 'MO(3)', 'MO(4)', 'MO(5)', 'MO(6)', 'MO(7)', 'MO(8)', 'MO(9)', 'MO(10)', 'MO(11)', 'MO(12)', 'MO(13)', 'MO(14)', 'MO(15)'];
keycodes[82] = ['DF(0)', 'DF(1)', 'DF(2)', 'DF(3)', 'DF(4)', 'DF(5)', 'DF(6)', 'DF(7)', 'DF(8)', 'DF(9)', 'DF(10)', 'DF(11)', 'DF(12)', 'DF(13)', 'DF(14)', 'DF(15)'];
keycodes[83] = ['TG(0)', 'TG(1)', 'TG(2)', 'TG(3)', 'TG(4)', 'TG(5)', 'TG(6)', 'TG(7)', 'TG(8)', 'TG(9)', 'TG(10)', 'TG(11)', 'TG(12)', 'TG(13)', 'TG(14)', 'TG(15)'];
keycodes[84] = ['OSL(0)', 'OSL(1)', 'OSL(2)', 'OSL(3)', 'OSL(4)', 'OSL(5)', 'OSL(6)', 'OSL(7)', 'OSL(8)', 'OSL(9)', 'OSL(10)', 'OSL(11)', 'OSL(12)', 'OSL(13)', 'OSL(14)', 'OSL(15)'];
keycodes[88] = ['TT(0)', 'TT(1)', 'TT(2)', 'TT(3)', 'TT(4)', 'TT(5)', 'TT(6)', 'TT(7)', 'TT(8)', 'TT(9)', 'TT(10)', 'TT(11)', 'TT(12)', 'TT(13)', 'TT(14)', 'TT(15)'];

// modKeyCombination
keycodes[1]  = 'LCTL(KC)';
keycodes[2]  = 'LSFT(KC)';
keycodes[4]  = 'LALT(KC)';
keycodes[8]  = 'LGUI(KC)';
keycodes[17] = 'RCTL(KC)';
keycodes[18] = 'RSFT(KC)';
keycodes[20] = 'RALT(KC)';
keycodes[24] = 'RGUI(KC)';
keycodes[10] = 'SGUI(KC)';

keycodes[5]  = 'LCA(KC)';
keycodes[6]  = 'LSA(KC)';
keycodes[22] = 'RSA(KC)';
keycodes[19] = 'RCS(KC)';
keycodes[13] = 'LCAG(KC)';
keycodes[7]  = 'MEH(KC)';
keycodes[15] = 'HYPR(KC)';
keycodes[7]  = 'KC_MEH';
keycodes[15] = 'KC_HYPR';

// modTapKeyCombination
keycodes[97] =  "CTL_T(KC)";
keycodes[98] =  "SFT_T(KC)";
keycodes[100] = "ALT_T(KC)";
keycodes[104] = "GUI_T(KC)";
keycodes[106] = "LSG_T(KC)";
keycodes[108] = "LAG_T(KC)";

keycodes[113] = "RCTL_T(KC)";
keycodes[114] = "RSFT_T(KC)";
keycodes[116] = "RALT_T(KC)";
keycodes[120] = "RGUI_T(KC)";
keycodes[122] = "RSG_T(KC)";
keycodes[124] = "RAG_T(KC)";

keycodes[101] = "LCA_T(A)";
keycodes[102] = "LSA_T(A)";
keycodes[118] = "LCAG_T(A";
keycodes[115] = "C_S_T(A)";
keycodes[109] = "MEH_T(A)";
keycodes[125] = "ALL_T(A)";

keycodes[99]  = "RSA_T(A)";
keycodes[103] = "RCS_T(A)";
keycodes[111] = "RCAG_T(A)";


export default keycodes;
