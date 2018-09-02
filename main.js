const electron = require('electron');
const path = require('path');
const url = require('url');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

//Listen for app be ready

// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({});
    // Load html in window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    //Build Menu from temeplate
    const mainMenu = Menu.buildFromTemplate(menuTemeplate);
    //Insert the Menu into the window
    Menu.setApplicationMenu(mainMenu);

});



//Handle create add Window

function createAddWindow() {
    addWindow = new BrowserWindow(
        {
            width:450,
            height: 250,
            title: 'Add Shopping list item'
        });
    //Load the html file into the window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    addWindow.on('closed', function () {
        addWindow = null;
    });
}

//Cath item:add
ipcMain.on('item:add', function (e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close()
});



//Create a menu temeplate
const menuTemeplate = [
    {},
    {
        label: 'file',
        submenu: [
            {
                label: 'Add item',
                accelerator: process.platform == 'darwin' ? 'Command+Shift+A' :
                'Ctrl+Shift+A',
                click() {
                    createAddWindow();
                }

            },
            {
                label: 'Clear items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                    'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//If mac, add an empty objetc to menu
if (process.platform == 'darwin') {
    menuTemeplate.unshift({});
}

//Add Developer Tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
    menuTemeplate.push(
        {
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' :
                        'Ctrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        });
}