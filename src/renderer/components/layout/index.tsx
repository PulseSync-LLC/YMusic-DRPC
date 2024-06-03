import styles from './layout.module.scss'
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'
import ButtonNav from '../button_nav'
import Discord from './../../../../static/assets/icons/discord.svg'
import {
    MdColorLens,
    MdConnectWithoutContact,
    MdDownload,
    MdEngineering,
    MdSettings,
    MdWarning,
} from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import userContext from '../../api/context/user.context'
import trackInitials from '../../api/interfaces/track.initials'

interface p {
    title: string
    children: any
    goBack?: boolean
}

const Layout: React.FC<p> = ({ title, children, goBack }) => {
    return (
        <>
            <Helmet>
                <title>{title + ' - PulseSync'}</title>
            </Helmet>
            <div className={styles.children}>
                <Header goBack={goBack} />
                <div className={styles.main_window}>
                    <div className={styles.navigation_bar}>
                        <div className={styles.navigation_buttons}>
                            <NavLink
                                to="/trackinfo"
                                className={({ isActive, isPending }) =>
                                    isPending
                                        ? 'pending'
                                        : isActive
                                            ? 'active'
                                            : ''
                                }
                            >
                                <ButtonNav>
                                    <Discord height={24} width={24} />
                                </ButtonNav>
                            </NavLink>
                            {/* <NavLink to="/theme" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                            <ButtonNav disabled>
                                <MdColorLens size={24} />
                            </ButtonNav>
                            {/* </NavLink> */}
                            {/* <NavLink to="/joint" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                            <ButtonNav disabled>
                                <MdConnectWithoutContact size={24} />
                            </ButtonNav>
                            {/* </NavLink> */}
                            <NavLink
                                to="/other"
                                className={({ isActive, isPending }) =>
                                    isPending
                                        ? 'pending'
                                        : isActive
                                            ? 'active'
                                            : ''
                                }
                            >
                                <ButtonNav>
                                    <MdSettings size={24} />
                                </ButtonNav>
                            </NavLink>
                        </div>
                        <button className={styles.update_download}>
                            <MdDownload size={26} />
                        </button>
                    </div>
                    {/* if pather is false */}
                    <div className={styles.alert_patch}>
                        <div>
                            <div>
                                <div className={styles.container_warn}><MdWarning size={38} /><div>У Яндекс Музыки отсутствует патч!</div></div>
                                <button><MdEngineering size={22} /> Запатчить</button>
                            </div>
                            <img src="static\assets\images\O^O.png" alt="" />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout
