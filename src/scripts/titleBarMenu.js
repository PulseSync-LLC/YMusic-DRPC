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

window.onload = async () => {
    try {
        let list = await window.drp.getThemesList()
        const selectItems = document.getElementById('select_items')

        list.forEach(theme => {
            const option = document.createElement('div')
            option.className = 'containerTheme'
            const img = document.createElement('img')
            img.src = theme.path + theme.image
            img.className = 'imageTheme'
            const textContentOption = document.createElement('div')
            textContentOption.textContent = theme.name
            selectItems.appendChild(option)
            option.appendChild(img)
            option.appendChild(textContentOption)
            option.addEventListener('click', () => {
                document.getElementById('select_selected').innerHTML = `
                <div class="containerTheme"><img class="imageTheme" src="${theme.path + theme.image}"><div>${theme.name} - ${theme.author}</div></div>
                `
                window.drp.selectStyle(theme.name, theme.author)
            })
        })

        const selectSelected = document.getElementById('select_selected')
        selectSelected.addEventListener('click', () => {
            if (selectItems.style.display === 'block') {
                selectItems.style.display = 'none'
            } else {
                selectItems.style.display = 'block'
            }
        })

        document.addEventListener('click', function (event) {
            var isClickInside = document
                .getElementById('custom_select')
                .contains(event.target)
            if (!isClickInside) {
                selectItems.style.display = 'none'
            }
        })
    } catch (error) {
        console.error('Error getting themes list:', error)
    }
}
