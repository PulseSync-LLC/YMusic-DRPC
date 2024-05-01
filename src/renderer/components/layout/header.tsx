import styles from './header.module.scss'
import React from 'react'

import Minus from './../../../../static/assets/icons/minus.svg'
import Minimize from './../../../../static/assets/icons/minimize.svg'
import Close from './../../../../static/assets/icons/close.svg'
import { MdDownload } from 'react-icons/md'

import Dev from './../../../../static/assets/badges/dev.svg'
import Early from './../../../../static/assets/badges/early.svg'
import Supporter from './../../../../static/assets/badges/supporter.svg'

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    return (
        <>
            <header className={styles.nav_bar}>
                <div className={styles.fix_size}>
                    <div className={styles.logoplace}>
                        <img
                            className={styles.logoapp}
                            src="static/assets/logo/logoapp.png"
                            alt=""
                        />
                        <span>PulseSync</span>
                    </div>
                    <div className={styles.event_container}>
                        <div className={styles.menu}>
                            <button className={styles.update_download}>
                                <MdDownload size={26} />
                            </button>
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
