const electron = require('electron');
var Positioner = require('electron-positioner');
const ipc = require('node-ipc');
ipc.config.id = 'screenCastWindow';
ipc.config.retry= 1500;

var url = process.argv[2];
var position = process.argv[3]
var width = parseInt(process.argv[4], 10)
var height = parseInt(process.argv[5], 10)

ipc.serve(() => {
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

  const windowOptions = {
    maxHeight: height,
    maxWidth: width,
    resize: false,
    width: width,
    height: height,
    darkTheme: true,
    alwayOnTop: true,
    show: false,
    frame: false,
    zoomFactor: 1.0,
  };

  const screenCastWindow = new electron.BrowserWindow(windowOptions);

  var positioner = new Positioner(screenCastWindow)
  positioner.move(position)

  screenCastWindow.loadURL(url)

  // Show window when page is ready
  screenCastWindow.once('ready-to-show', function () {
    screenCastWindow.show();
    screenCastWindow.focus();
  });

});

