const closeApp = document.getElementById('close')
const minimizeApp = document.getElementById('minimize')
const patcherApp = document.getElementById('patch')
const unpatcherApp = document.getElementById('unpatch')
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
        unpatcherApp.disabled = true
    } catch (error) {
        console.error('Error closing window:', error)
    }
})

unpatcherApp.addEventListener('click', async event => {
    unpatcherApp.disabled = true
    event.preventDefault()
    try {
        await window.drp.clickUnpatcher()
        patcherApp.disabled = true
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

function selectorSelectTheme(theme) {
    document.getElementById('select_selected').innerHTML = `
<div class="containerTheme">
    <div class="containerInfo">
        <img class="imageTheme" src="${theme.path + theme.image}">
        <m>
            <span class="themeName">${theme.name} - </span><span class="themeAuthor">${theme.author}</span>
            <div class="themeVersion">${theme.version}</div>
        <m/>
    </div>
    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5334 15.9833L20 22.45L26.4667 15.9833C27.1167 15.3333 28.1667 15.3333 28.8167 15.9833C29.4667 16.6333 29.4667 17.6833 28.8167 18.3333L21.1667 25.9833C20.5167 26.6334 19.4667 26.6334 18.8167 25.9833L11.1667 18.3333C10.5167 17.6833 10.5167 16.6333 11.1667 15.9833C11.8167 15.35 12.8834 15.3333 13.5334 15.9833Z" fill="#CADBF4"/>
    </svg>
</div>
`
}

window.onload = async () => {
    window.drp
        .checkFileExists()
        .then(fileExists => {
            if (fileExists) {
                patcherApp.disabled = true
                unpatcherApp.disabled = false
            } else {
                patcherApp.disabled = false
                unpatcherApp.disabled = true
            }
        })
        .catch(err => {
            console.error('Ошибка при проверке файла:', err)
        })

    window.drp
        .checkSelectedStyle()
        .then(theme => {
            selectorSelectTheme(theme)
        })
        .catch(error => {
            console.error("Error checking selected style:", error)
        })

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
            textContentOption.textContent = `${theme.name} - ${theme.author} (${theme.version})`
            selectItems.appendChild(option)
            option.appendChild(img)
            option.appendChild(textContentOption)
            option.addEventListener('click', () => {
                selectorSelectTheme(theme)
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
