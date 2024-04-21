import styles from './header.module.scss'
import React from 'react'

import { FiMinus } from 'react-icons/fi'
import Minimize from './../../../../static/assets/icons/minimize.svg'
import Close from './../../../../static/assets/icons/close.svg'

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
                    <div className={styles.button_container}>
                        <button id="hide" className={styles.button_title}>
                            <FiMinus size={24} />
                        </button>
                        <button id="minimize" className={styles.button_title}>
                            <Minimize />
                        </button>
                        <button id="close" className={styles.button_title}>
                            <Close />
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
