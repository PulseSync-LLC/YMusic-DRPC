const closeApp = document.getElementById("close")
const minimizeApp = document.getElementById("minimize")
const patcherApp = document.getElementById("patch")

minimizeApp.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        await window.drp.clickMinimize();
    } catch (error) {
        console.error('Error minimizing window:', error);
    }
})

closeApp.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        await window.drp.clickClose();
    } catch (error) {
        console.error('Error closing window:', error);
    }
})

patcherApp.addEventListener('click', async (event) => {
    patcherApp.disabled = true;
    event.preventDefault();
    try {
        await window.drp.clickPatcher();
    } catch (error) {
        console.error('Error closing window:', error);
    }
})

window.onload = () => {
    window.drp.checkFileExists().then(fileExists => {
        if (fileExists) {
            patcherApp.disabled = true;
        }
    }).catch(err => {
        console.error("Ошибка при проверке файла:", err);
    });
};


setInterval(() => {
    console.log(window.drp.requestTrackInfo())
}, 1000);
