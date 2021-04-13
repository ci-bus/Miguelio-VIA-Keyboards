const { app, BrowserWindow, ipcMain } = require('electron'),
    path = require('path'),
    Store = require('./store.js'),
    HID = require('node-hid'),
    fs = require('fs');

app.disableHardwareAcceleration();

const store = new Store({
    configName: 'user-preferences',
    defaults: {
        windowBounds: { width: 1200, height: 800 }
    }
});

function createWindow() {
    let { width, height } = store.get('windowBounds');
    let mainWindow = new BrowserWindow({
        width, height,
        webPreferences: {
            minimumFontSize: 14,
            defaultFontSize: 17,
            defaultMonospaceFontSize: 19,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
            contextIsolation: false
        }
    });

    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        store.set('windowBounds', { width, height });
    });

    mainWindow.openDevTools();

    mainWindow.loadFile('./dist/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

ipcMain.handle('ping', async (event, someArgument) => {
    return 'pong';
});

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});



///////////////////////////////////
//                               //
//  QMK COMUNICATION WITH via.c  //
//                               //
///////////////////////////////////


//------------------------//
//  Get supported devices //
//------------------------//
ipcMain.handle('getDevicesList', async () => {
    const devices = HID.devices().filter(device => {
        return device.interface === 1
            && fs.existsSync(`./src/assets/keyboards/${device.vendorId}_${device.productId}.json`);
    });
    return devices;
});

//------------------------//
//    Get count layers    //
//------------------------//
ipcMain.handle('countLayers', async (event, keyboard) => {
    // Open conecction
    var device = new HID.HID(keyboard.path);
    // Send request
    device.write([17]);
    // Wait response
    const count = await new Promise((ok, fail) => {
        // On receive response
        device.on("data", function (buffer) {
            // Return info
            ok(buffer.readUInt8(1));
        });
        // On error
        device.on('error', fail);

    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());
    
    return count;
});


//----------------------------------------//
//  Reset keymap to undo dynamic changes  //
//----------------------------------------//
ipcMain.handle('keymapReset', async (event, keyboard) => {
    // Open conecction
    var device = new HID.HID(keyboard.path);
    // Send request
    device.write([6]);
    // Wait reset done
    const response = await new Promise((ok, fail) => {
        // On receive response
        device.on("data", ok);
        // On error
        device.on('error', fail);
    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

    return response;
});



//------------------------//
//      Load keymaps      //
//------------------------//
ipcMain.handle('loadKeymaps', async (event, data) => {

    // Open conecction
    var device = new HID.HID(data.keyboard.path);

    // Create vars with info
    let layers = data.defs.layers,
        BloqBufferSize = 28,
        bufferBits = 8,
        keyBits = 16,
        bitsRatio = keyBits / bufferBits,
        offSetData = 4,
        keysByLayer = data.defs.cols * data.defs.rows,
        totalKeys = keysByLayer * layers;



    // Read first buffer
    device.write([18, 0, 0, BloqBufferSize]);


    const keymaps = await new Promise((ok, fail) => {

        // Temp vars to control loading
        let bloq = 0,
            count = 0,
            countLayers = 0,
            keymaps = [],
            keys = [];

        // On receive keycodes bloq
        device.on("data", function (buffer) {

            // Read keys from buffer
            for (let i = offSetData; i < offSetData + BloqBufferSize; i += bitsRatio) {

                // Save key bytes
                keys.push({
                    firstByte: buffer.readUInt8(i),
                    secondByte: buffer.readUInt8(i + 1)
                });

                count++;

                // Keymap layer completed
                if (count % keysByLayer === 0) {
                    keymaps.push({ number: countLayers, keys });
                    countLayers++;
                    keys = [];
                }

                // All loaded
                if (count == totalKeys) {

                    // Return keymaps
                    ok(keymaps);
                    break;
                }
            }

            bloq++;

            // Send porcent loading
            let porcentLoaded = Math.ceil(count * 100 / totalKeys);
            event.sender.send('layersPorcent', porcentLoaded);

            if (count < totalKeys) {

                // Calcule offset buffer
                let offSetBuffer = bloq * BloqBufferSize;

                // Read next buffer
                device.write([18, Math.floor(offSetBuffer / 256), offSetBuffer % 256, BloqBufferSize]);

            }
        });

        // On error
        device.on('error', (error) => {
            fail(error);
        });

    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

    return keymaps;
});


//------------------------//
//    Get light config    //
//------------------------//
ipcMain.handle('loadLight', async (event, data) => {
    // Open conecction
    var device = new HID.HID(data.keyboard.path);

    // Load backlight brightness
    device.write([8, 9, 0]);

    // Wait response
    const brightness = await new Promise((ok, fail) => {
        // On receive response
        device.on("data", function (buffer) {
            // Return info
            ok(buffer.readUInt8(2));
        });
        // On error
        device.on('error', fail);

    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

    // Open conecction
    var device = new HID.HID(data.keyboard.path);

    // Load backlight effect
    device.write([8, 10, 0]);

    // Wait response
    const effect = await new Promise((ok, fail) => {
        // On receive response
        device.on("data", function (buffer) {
            // Return info
            ok(buffer.readUInt8(2));
        });
        // On error
        device.on('error', fail);

    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

    return {
        backlight: {
            brightness,
            effect
        }
    };
});


//-----------------------------//
//   Change light prop value   //
//-----------------------------//
ipcMain.handle('changeLight', async (event, data) => {
    // Open conecction
    var device = new HID.HID(data.keyboard.path);

    // set backlight prop value
    device.write([7, data.prop, data.firstByte, data.secondByte]);

    // Wait response
    const res = await new Promise((ok, fail) => {
        // On receive response
        device.on("data", response => {
            // Save changes
            device.write([9]);
            // Return response
            ok(response);
        });
        // On error
        device.on('error', fail);
    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

    return res.readUInt8(1) == data.prop
        && res.readUInt8(2) == data.firstByte
        && res.readUInt8(3) == data.secondByte;
});


//--------------------//
//   Change keycode   //
//--------------------//
ipcMain.handle('setKeycode', async (event, data) => {

    // Open conecction
    var device = new HID.HID(data.path);

    // set backlight prop value
    device.write([5, data.layer, data.row, data.col, data.firstByte, data.secondByte]);

    // Wait response
    const res = await new Promise((ok, fail) => {
        // On receive response
        device.on("data", ok);
        // On error
        device.on('error', fail);
    })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

    // Send finish loading
    event.sender.send('setKeycodeFinish', true);

    return res.readUInt8(1) == data.layer
        && res.readUInt8(2) == data.row
        && res.readUInt8(3) == data.col;
});


