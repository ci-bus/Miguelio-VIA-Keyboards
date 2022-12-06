const { app, BrowserWindow, ipcMain } = require('electron'),
  Store = require('./store.js'),
  HID = require('node-hid'),
  fs = require('fs'),
  glob = require("glob"),
  DownloadManager = require("electron-download-manager");
const path = require('path');
const url = require('url');

app.disableHardwareAcceleration();

/*******************************************************************\
|   Put to true to show in console the keycodes when load layouts   |
\*******************************************************************/
const consoleKeycodes = false;

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 1200, height: 800 },
    config: {}
  }
});

const getConfig = () => {
  const storedConfig = store.get('config'),
    config = JSON.parse(fs.readFileSync(__dirname + '/default-config.json'));

  return Object.assign(config, storedConfig);
}

function createWindow() {
  let { width, height } = store.get('windowBounds'),
    { version } = getConfig();

  if (width < 1000) width = 1000;
  if (height < 600) height = 600;

  const mainWindow = new BrowserWindow({
    width, height,
    webPreferences: {
      minimumFontSize: 12,
      defaultFontSize: 17,
      defaultMonospaceFontSize: 19,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      contextIsolation: false,
      additionalArguments: [
        `--version=${version}`
      ]
    }
  });

  mainWindow.removeMenu();

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    if (width < 1000) width = 1000;
    if (height < 600) height = 600;
    store.set('windowBounds', { width, height });
  });

  // Discomment to open devTools on init
  // mainWindow.openDevTools();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:'
  }));
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



//--------------------------//
//  Download files from web //
//--------------------------//
DownloadManager.register({
  downloadFolder: app.getPath("downloads")
});

ipcMain.handle('downloadFile', async (event, url) => {
  const res = await new Promise((ok, fail) => {
    DownloadManager.download({ url }, (error, info) => {
      if (error) {
        fail(error);
        return;
      }
      ok(info);
    });
  })
    .catch(error => event.sender.send('error', error));
  return res;
});


//------------------------//
// Update json defs files //
//------------------------//
let updatingJsonFile = false;
const checkJsonVersionAndUpdate = (devices) => {
  updatingJsonFile = true;
  try {
    for (const device of devices) {
      let file = JSON.parse(fs.readFileSync(device.pathJson));
      if (file.vdoc !== 2) {
        console.log("Updating...", device.pathJson);
        updatedLayouts = [],
          tempFreeSpaceMatrix = [];
        for (let layout of file.layouts) {

          // Remap keymap matrix
          let tempKeymap = layout.keymap;
          for (let r = 0; r < layout.matrix.length; r++) {
            for (let c = 0; c < layout.matrix[r].length; c++) {
              if (layout.matrix[r][c]) {
                const rKey = layout.matrix[r][c][0];
                const cKey = layout.matrix[r][c][1];
                if (typeof tempKeymap[rKey][cKey] == 'number') {
                  tempKeymap[rKey][cKey] = {
                    u: tempKeymap[rKey][cKey],
                    matrix: [r, c]
                  };
                } else if (typeof tempKeymap[rKey][cKey] == 'object') {
                  tempKeymap[rKey][cKey].matrix = [r, c];
                } else {
                  throw `[ Error ] type of key into json defs ${rKey}${cKey}`;
                }
              } else {
                // Add free space matrix
                tempFreeSpaceMatrix.push([r, c]);
              }
            }
          }

          // Remap keys
          let tempLayout = {
            name: layout.name,
            keymap: []
          };
          let y = 0;
          let count = 0;
          for (let r = 0; r < tempKeymap.length; r++) {
            let x = 0;
            for (let c = 0; c < tempKeymap[r].length; c++) {
              if (tempKeymap[r][c]) {
                let tempKey = {
                  x, y, label: `K${count}`
                };
                // Create updated key
                if (typeof tempKeymap[r][c] == 'number') { // Number
                  // Key size
                  tempKey.w = tempKeymap[r][c];
                  x += tempKeymap[r][c];
                } else if (typeof tempKeymap[r][c] == 'object') { // Object
                  // Key size
                  tempKey.w = tempKeymap[r][c].u;
                  // Special key
                  if (tempKeymap[r][c].s == 'ISO_ENTER') {
                    tempKey.w = 1.5;
                    tempKey.h = 2;
                  } else if (tempKeymap[r][c].s) {
                    tempKey.s = tempKeymap[r][c].s;
                  }
                  // Color key
                  if (tempKeymap[r][c].color) {
                    tempKey.color = tempKeymap[r][c].color;
                  }
                  // Matrix
                  tempKey.matrix = tempKeymap[r][c].matrix;
                  x += tempKeymap[r][c].u;
                } else {
                  throw `[ Error ] type of key into json defs ${rKey}${cKey}`;
                }
                // Add updated key to keymap
                if (!tempKeymap[r][c].f && tempKey.matrix && tempKey.w) {
                  tempLayout.keymap.push(tempKey);
                }
                count++;
              }
            }
            y++;
          }
          updatedLayouts.push(tempLayout);
        }
        // Override update data
        file.layouts = updatedLayouts;
        file.freeSpaceMatrix = tempFreeSpaceMatrix;
        file.vdoc = 2;
        // Save file
        let jsonString = JSON.stringify(file);
        fs.writeFile(device.pathJson, jsonString, error => {
          if (error) {
            console.log("[ Error ]", error);
          } else {
            console.log("[ OK ] file updated");
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
  updatingJsonFile = false;
};


///////////////////////////////////
//                               //
//  QMK COMUNICATION WITH via.c  //
//                               //
///////////////////////////////////


//------------------------//
//  Get supported devices //
//------------------------//
ipcMain.handle('getDevicesList', async () => {
  const keyboardsDefs = glob.sync(__dirname + "/dist/assets/keyboards/**/*.json");
  const devices = HID.devices().map(device => ({
    ...device, pathJson: keyboardsDefs.find(kd => kd.split('/').pop() === `${device.vendorId}_${device.productId}.json`)
  })).filter(device => device.pathJson && device.interface === 1);
  // Check json version and update
  /*
  if (!updatingJsonFile && devices.length) {
    checkJsonVersionAndUpdate(keyboardsDefs.map(kd => ({
      pathJson: kd
    })));
  }
  */
  return devices;
});

//------------------------//
//    Get count layers    //
//------------------------//
ipcMain.handle('countLayers', async (event, keyboard) => {

  // Open conecction
  var device = new HID.HID(keyboard.path);

  // Send request
  device.write([0x00, 17]);

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
ipcMain.handle('resetKeycodes', async (event, keyboard) => {
  // Open conecction
  var device = new HID.HID(keyboard.path);
  // Send request
  device.write([0x00, 6]);
  // Wait reset done
  const response = await new Promise((ok, fail) => {
    // On receive response
    device.on("data", () => { ok(true) });
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
  device.write([0x00, 18, 0, 0, BloqBufferSize]);


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

        if (consoleKeycodes) {
          console.log('Keycode', buffer.readUInt8(i), buffer.readUInt8(i + 1), buffer.readUInt16LE(i));
        }

        count++;

        // Keymap layer completed
        if (count % keysByLayer === 0) {
          keymaps.push({ number: countLayers, keys });
          countLayers++;
          keys = [];
          if (consoleKeycodes) {
            console.log("======================================================");
          }
        }

        // All loaded
        if (count == totalKeys + 1) {

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
        device.write([0x00, 18, Math.floor(offSetBuffer / 256), offSetBuffer % 256, BloqBufferSize]);

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

  // Backlight
  if (data.lighting.backlight) {

    // Load backlight brightness
    device.write([0x00, 8, 9, 0]);

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
      .catch(error => event.sender.send('error', error));

    // Load backlight effect
    device.write([0x00, 8, 10, 0]);

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
  }

  // RGB light
  if (data.lighting.rgblight) {

    // Load RGB brightness
    device.write([0x00, 8, 128, 0]);

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
      .catch(error => event.sender.send('error', error));

    // Load RGB effect
    device.write([0x00, 8, 129, 0]);

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
      .catch(error => event.sender.send('error', error));

    // Load RGB effect speed
    device.write([0x00, 8, 130, 0]);

    // Wait response
    const effectSpeed = await new Promise((ok, fail) => {
      // On receive response
      device.on("data", function (buffer) {
        // Return info
        ok(buffer.readUInt8(2));
      });
      // On error
      device.on('error', fail);

    })
      .catch(error => event.sender.send('error', error));

    // Load RGB color
    device.write([0x00, 8, 131, 0]);

    // Wait response
    const color = await new Promise((ok, fail) => {
      // On receive response
      device.on("data", function (buffer) {
        // Return info
        ok({
          hue: buffer.readUInt8(2),
          sat: buffer.readUInt8(3)
        });
      });
      // On error
      device.on('error', fail);

    })
      .catch(error => event.sender.send('error', error))
      .finally(() => device.close());

    return {
      rgblight: {
        brightness,
        effect,
        effectSpeed,
        color
      }
    };
  }

});


//-----------------------------//
//   Change light prop value   //
//-----------------------------//
ipcMain.handle('changeLight', async (event, data) => {
  // Open conecction
  var device = new HID.HID(data.keyboard.path);

  // Set backlight prop value
  device.write([0x00, 7, data.prop, data.firstByte, data.secondByte]);

  // Wait response
  const res = await new Promise((ok, fail) => {
    // On receive response
    device.on("data", response => {
      // Save changes
      device.write([0x00, 9]);
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

  // Set keycode prop value
  device.write([0x00, 5, data.layer, data.row, data.col, data.firstByte, data.secondByte]);

  // Wait response
  const res = await new Promise((ok, fail) => {
    // On receive response
    device.on("data", ok);
    // On error
    device.on('error', fail);
  })
    .catch(error => event.sender.send('error', error))
    .finally(() => device.close());

  // Send finish seting
  event.sender.send('setKeycodeFinish', true);

  return res.readUInt8(1) == data.layer
    && res.readUInt8(2) == data.row
    && res.readUInt8(3) == data.col;
});

//-------------//
// Add Support //
//-------------//
ipcMain.handle('addSupport', async (event, data) => {
  let jsonString = JSON.stringify(data.support);
  fs.mkdir(__dirname + "/dist/assets/keyboards/" + data.keyboardDir, { recursive: true }, err => {
    if (err) {
      console.log('Error', err);
      event.sender.send('error', err);
    } else {
      fs.writeFile(__dirname + "/dist/assets/keyboards/" + data.keyboardDir + "/" + data.fileName, jsonString, error => {
        if (error) {
          console.log("Error:", error);
          event.sender.send('error', error);
        } else {
          event.sender.send('success', true);
        }
      });
    }
  });
});


//-------------//
//   Version   //
//-------------//
ipcMain.handle('setVersion', async (event, version) => {
  store.set('config', { version });
  event.sender.send('success', true);
});


//-------------------//
// Free Space Values //
//-------------------//
ipcMain.handle('saveFreeSpaceValues', async (event, data) => {

  // Open conecction
  var device = new HID.HID(data.path);

  for (let item of data.freeSpaceValues) {
    // Save values
    device.write([0x00, 5, item.layer, item.row, item.col, item.values.firstByte, item.values.secondByte]);

    // Wait response
    await new Promise((ok, fail) => {
      // On receive response
      device.on("data", ok);
      // On error
      device.on('error', fail);
    })
      .catch(error => event.sender.send('error', error));
  }

  device.close()
  event.sender.send('success', true);

  return true;
});
