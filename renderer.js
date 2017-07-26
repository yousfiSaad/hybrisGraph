
$(function(){

    const {ipcRenderer} = require('electron')

    ipcRenderer.on('dependencies', (event, dependencies) => {
        // console.log(dependencies);//TODO
        
        window.yS.Graph.draw(dependencies);
    });


    const scanButton = document.querySelector('#scan-button'),
          scanInput   = document.querySelector('#scan-input');
    
    scanButton.addEventListener('click', ()=>{
        const path = scanInput.value;
        
        ipcRenderer.send('scan-folder', path);
    });
    
});