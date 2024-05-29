import styles from './header.module.scss'
import React, { useContext, useState } from 'react'

import Minus from './../../../../static/assets/icons/minus.svg'
import Minimize from './../../../../static/assets/icons/minimize.svg'
import Close from './../../../../static/assets/icons/close.svg'

import Dev from './../../../../static/assets/badges/dev.svg'
import Early from './../../../../static/assets/badges/early.svg'
import Supporter from './../../../../static/assets/badges/supporter.svg'
import PatchMenu from '../context_menu'
import UserContext from '../../api/context/user.context'
import userContext from '../../api/context/user.context'

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, loading } = useContext(userContext)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    return (
        <>
            <header className={styles.nav_bar}>
                <div className={styles.fix_size}>
                    <div className={styles.app_menu}>
                        <div className={styles.logoplace}>
                            <img
                                className={styles.logoapp}
                                src="static/assets/logo/logoapp.svg"
                                alt=""
                            />
                            <span>PulseSync</span>
                        </div>
                        <div className="patch-button-container">
                            <button
                                className="patch-button"
                                onClick={toggleMenu}
                            >
                                Патчер
                            </button>
                            {isMenuOpen && <PatchMenu />}
                        </div>
                        <div className={styles.version}>FUMOS V1.0.0</div>
                    </div>
                    <div className={styles.event_container}>
                        <div className={styles.menu}>
                            {user.perms !== "default" &&
                                <div className={styles.badges_container}>
                                    <img
                                        src={`static/assets/badges/${user.perms}.svg`}
                                        alt=""
                                    />
                                </div>
                            }
                            {user.id !== "-1" &&
                            <div className={styles.user_container}>
                                <img
                                    src={user.avatar}
                                    alt=""
                                />
                                {user.username}
                            </div>
                            }
                        </div>
                        <div className={styles.button_container}>
                            <button
                                id="hide"
                                className={styles.button_title}
                                onClick={() => window.electron.window.minimize()}
                            >
                                <Minus />
                            </button>
                            <button
                                id="minimize"
                                className={styles.button_title}
                                onClick={() => window.electron.window.maximize()}
                            >
                                <Minimize />
                            </button>
                            <button
                                id="close"
                                className={styles.button_title}
                                onClick={() => window.electron.window.close()}
                            >
                                <Close />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
