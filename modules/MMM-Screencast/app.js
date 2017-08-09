const electron = require('electron');
var Positioner = require('electron-positioner');
const ipc = require('node-ipc');
ipc.config.id = 'screenCastWindow';
ipc.config.retry= 1500;

var window = null;
var mainWindow = null;
var url = process.argv[2];
var position = process.argv[3]
var width = process.argv[4]
var height = process.argv[5]

ipc.serve(() => {
  ipc.server.on('set_mainWindow', (data, socket) => {
    mainWindow = data.mainWindow;
    console.log(mainWindow);
    ipc.server.emit(socket, 'quit');
  });
  ipc.server.on('quit', (data, socket) => {
    ipc.server.emit(socket, 'quit');
    app.quit();
    process.exit();
  });
});

ipc.server.start();

// Wait until the app is ready
const app = electron.app;
app.once('ready', function () {
  // Create a new window
  // console.log(electron.dialog.showErrorBox('hello', process.argv.join(' ')))
  window = new electron.BrowserWindow({
    // Set the initial width to 500px
    width: width,
    // Set the initial height to 400px
    height: height,
    darkTheme: true,
    parent: mainWindow,
    alwayOnTop: true,
    show: false,
    frame: false
  })

  var positioner = new Positioner(window)
  positioner.move(position)

  window.loadURL(url)

  // Show window when page is ready
  window.once('ready-to-show', function () {
    window.show();
    window.focus();
  });

  window.on("closed", function() {
    window = null;
  });
});

