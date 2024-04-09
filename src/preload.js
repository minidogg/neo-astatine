// Import the necessary Electron components.
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;
// const path = require('path')

// White-listed channels.
const ipc = {
    'render': {
        // From render to main.
        'send': [
            'window:minimize',
            'window:maximize',
            'window:restore',
            'window:close'
        ],
        // From main to render.
        'receive': [],
        // From render to main and back again.
        'sendReceive': []
    }
};

// Exposed protected methods in the render process.
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods.
    'ipcRender', {
        // From render to main.
        send: (channel, args) => {
            let validChannels = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, args);
            }
        },
        // From main to render.
        receive: (channel, listener) => {
            let validChannels = ipc.render.receive;
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`.
                ipcRenderer.on(channel, (event, ...args) => listener(...args));
            }
        },
        // From render to main and back again.
        invoke: (channel, args) => {
            let validChannels = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
);

// var fs = require('fs')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('DOMContentLoaded', async () => {
    console.log("Window Loaded")
    
    if(window.location.href.endsWith("install.html")){
        ipcRenderer.invoke("doneLoad")
        document.getElementById("path").value = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Bopl Battle"
        document.getElementById("setPath").onclick = async ()=>{
            ipcRenderer.invoke('dialog',"showOpenDialogSync",{
                properties: ['openFile', 'openDirectory']
              }).then((e)=>{
                // console.log(e)
                document.getElementById("path").value = e[0]
              })
        }
        document.getElementById("next").onclick = async()=>{
            let bepinex = await ipcRenderer.invoke("fs","existsSync",(await ipcRenderer.invoke("path","join",document.getElementById("path").value,"\\BepInEx\\plugins")))
            let splotch = await ipcRenderer.invoke("fs","existsSync",(await ipcRenderer.invoke("path","join",document.getElementById("path").value,"\\splotch_mods")))

            console.log(bepinex)
            console.log(splotch)

            if(!bepinex){
                alert("Please install BepInEx!")
                return
            }
            if(!splotch){
                alert("Please install Splotch!")
                return
            }
        }

    }
    
})
