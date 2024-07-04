import styles from './header.module.scss'
import React, { useContext, useEffect, useState } from 'react'

import Minus from './../../../../static/assets/icons/minus.svg'
import Minimize from './../../../../static/assets/icons/minimize.svg'
import Close from './../../../../static/assets/icons/close.svg'
import ArrowDown from './../../../../static/assets/icons/arrowDown.svg'

import userContext from '../../api/context/user.context'
import ContextMenu from '../context_menu'

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [version, setVersion] = useState(null)
    const { user, loading } = useContext(userContext)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && window.desktopEvents) {
            window.desktopEvents
                ?.invoke('getVersion')
                .then((version: string | undefined) => {
                    console.log(version)
                    setVersion(version)
                })
        }
    }, [])
    return (
        <>
            <header className={styles.nav_bar}>
                <div className={styles.fix_size}>
                    <div className={styles.app_menu}>
                        <button
                            className={styles.logoplace}
                            onClick={toggleMenu}
                        >
                            <img
                                className={styles.logoapp}
                                src="static/assets/logo/logoapp.svg"
                                alt=""
                            />
                            <span>PulseSync</span>
                            <div
                                className={
                                    isMenuOpen ? styles.true : styles.false
                                }
                            >
                                <ArrowDown />
                            </div>
                            {isMenuOpen && <ContextMenu />}
                        </button>
                    </div>
                    <div className={styles.event_container}>
                        <div className={styles.menu}>
                            {user.id !== '-1' && (
                            <div className={styles.badges_container}>
                                {user.badges.length > 0 &&
                                    user.badges.map(_badge => (
                                        <div
                                            className={styles.badge}
                                            key={_badge.type}
                                        >
                                            <img
                                                src={`static/assets/badges/${_badge.type}.svg`}
                                                alt={_badge.type}
                                            />
                                            <span className={styles.tooltip}>
                                                {_badge.name}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            )}

                            {user.id !== '-1' && (
                                <div className={styles.user_container}>
                                    <img src={user.avatar} alt="" />
                                    {user.username}
                                </div>
                            )}
                        </div>
                        <div className={styles.button_container}>
                            <button
                                id="hide"
                                className={styles.button_title}
                                onClick={() =>
                                    window.electron.window.minimize()
                                }
                            >
                                <Minus />
                            </button>
                            <button
                                id="minimize"
                                className={styles.button_title}
                                onClick={() =>
                                    window.electron.window.maximize()
                                }
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
