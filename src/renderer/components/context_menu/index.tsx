import React, { useContext } from 'react'
import styles from './context_menu.module.scss'
import userContext from '../../api/context/user.context'
import { shell } from 'electron'
import SettingsInterface from '../../api/interfaces/settings.interface'

const ContextMenu: React.FC = () => {
    const { settings, setSettings } = useContext(userContext)
    const patch = () => {
        window.electron.patcher.patch()
        setSettings((prevSettings: SettingsInterface) => ({
            ...prevSettings,
            patched: true,
        }))
    }
    const repatch = () => {
        window.electron.patcher.repatch()
    }
    const depatch = () => {
        window.electron.patcher.depatch()
        setSettings((prevSettings: SettingsInterface) => ({
            ...prevSettings,
            patched: false,
        }))
    }
    const githubLink = () => {
        window.open('https://github.com/PulseSync-Official/YMusic-DRPC')
    }

    return (
        <div className={styles.patchMenu}>
            <button onClick={patch} disabled={settings.patched}>
                ПАТЧ
            </button>
            <button onClick={repatch} disabled={!settings.patched}>
                РЕПАТЧ
            </button>
            <button onClick={depatch} disabled={!settings.patched}>
                ДЕПАТЧ
            </button>
            <button onClick={githubLink} className={styles.hyperLink}>
                СКРИПТ ПАТЧЕРА НА GITHUB
            </button>
        </div>
    )
}

export default ContextMenu
