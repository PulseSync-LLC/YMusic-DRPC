import styles from './header.module.scss'
import React, { useState } from 'react'

import Minus from './../../../../static/assets/icons/minus.svg'
import Minimize from './../../../../static/assets/icons/minimize.svg'
import Close from './../../../../static/assets/icons/close.svg'

import Dev from './../../../../static/assets/badges/dev.svg'
import Early from './../../../../static/assets/badges/early.svg'
import Supporter from './../../../../static/assets/badges/supporter.svg'
import PatchMenu from '../context_menu'

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                        <div className={styles.version}>PUBLIC V1.0.3</div>
                    </div>
                    <div className={styles.event_container}>
                        <div className={styles.menu}>
                            <div className={styles.badges_container}>
                                <Dev />
                                <Early />
                                <Supporter />
                            </div>
                            <div className={styles.user_container}>
                                <img
                                    src="https://media.discordapp.net/attachments/482180995752394752/1234142800224714793/photo_2024-04-25_22-46-45.jpg"
                                    alt=""
                                />
                                Maks1mio
                            </div>
                        </div>
                        <div className={styles.button_container}>
                            <button
                                id="hide"
                                className={styles.button_title}
                                onClick={window.electron.window.minimize}
                            >
                                <Minus />
                            </button>
                            <button
                                id="minimize"
                                className={styles.button_title}
                                onClick={window.electron.window.maximize}
                            >
                                <Minimize />
                            </button>
                            <button
                                id="close"
                                className={styles.button_title}
                                onClick={window.electron.window.close}
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
