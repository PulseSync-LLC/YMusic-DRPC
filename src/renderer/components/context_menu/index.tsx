import React, { useContext } from 'react'
import styles from './context_menu.module.scss'
import userContext from '../../api/context/user.context'

const ContextMenu: React.FC = () => {
    const { user, setUser } = useContext(userContext)
    const patch = () => {
        window.electron.patcher.patch()
        setUser((prevUser: any) => ({
            ...prevUser,
            patched: true,
        }))
    }
    const repatch = () => {
        window.electron.patcher.repatch()
    }
    const depatch = () => {
        window.electron.patcher.depatch()
        setUser((prevUser: any) => ({
            ...prevUser,
            patched: false,
        }))
    }

    return (
        <div className={styles.patchMenu}>
            <button onClick={patch} disabled={user.patched}>
                ПАТЧ
            </button>
            <button onClick={repatch} disabled={!user.patched}>
                РЕПАТЧ
            </button>
            <button onClick={depatch} disabled={!user.patched}>
                ДЕПАТЧ
            </button>
            <button className={styles.hyperLink}>
                СКРИПТ ПАТЧЕРА НА GITHUB
            </button>
        </div>
    )
}

export default ContextMenu
