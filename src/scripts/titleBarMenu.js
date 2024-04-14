const closeApp = document.getElementById('close')
const minimizeApp = document.getElementById('minimize')
const patcherApp = document.getElementById('patch')
const pathApp = document.getElementById('pathapp')
const pathStyle = document.getElementById('pathstyle')

minimizeApp.addEventListener('click', async event => {
    event.preventDefault()
    try {
        await window.drp.clickMinimize()
    } catch (error) {
        console.error('Error minimizing window:', error)
    }
})

closeApp.addEventListener('click', async event => {
    event.preventDefault()
    try {
        await window.drp.clickClose()
    } catch (error) {
        console.error('Error closing window:', error)
    }
})

patcherApp.addEventListener('click', async event => {
    patcherApp.disabled = true
    event.preventDefault()
    try {
        await window.drp.clickPatcher()
    } catch (error) {
        console.error('Error closing window:', error)
    }
})

pathApp.addEventListener('click', async event => {
    event.preventDefault()
    try {
        await window.drp.pathAppOpen()
    } catch (error) {
        console.error('Error closing window:', error)
    }
})

pathStyle.addEventListener('click', async event => {
    event.preventDefault()
    try {
        await window.drp.pathStyleOpen()
    } catch (error) {
        console.error('Error closing window:', error)
    }
})

window.onload = () => {}

const styleSelect = document.getElementById('style_select')

styleSelect.addEventListener('change', async event => {
    event.preventDefault()
    let selectedStyle = styleSelect.value // Получаем название файла стиля из свойства value
    console.log(selectedStyle)
    try {
        await window.drp.selectStyle(selectedStyle) // Передаем название файла стиля в функцию
        console.log('Выбран стиль:', selectedStyle)
    } catch (error) {
        console.error('Ошибка выбора стиля:', error)
    }
})

window.onload = async () => {
    window.drp
        .checkFileExists()
        .then(fileExists => {
            if (fileExists) {
                patcherApp.disabled = true
            }
        })
        .catch(err => {
            console.error('Ошибка при проверке файла:', err)
        })

    try {
        let list = await window.drp.getThemesList()
        list.forEach(folder => {
            const option = document.createElement('option')
            option.value = folder
            option.textContent = folder
            styleSelect.appendChild(option)
        })
    } catch (error) {
        console.error('Error getting themes list:', error)
    }
}
