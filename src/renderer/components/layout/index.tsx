import styles from './layout.module.scss'
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'
import ButtonNav from '../button_nav'
import Discord from './../../../../static/assets/icons/discord.svg'
import {
    MdArchitecture,
    MdColorLens,
    MdConnectWithoutContact,
    MdHome,
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
                        <NavLink
                            to="/"
                            className={({ isActive, isPending }) =>
                                isPending ? 'pending' : isActive ? 'active' : ''
                            }
                        >
                            <ButtonNav>
                                <MdHome size={24} />
                                Основные настройки
                            </ButtonNav>
                        </NavLink>
                        <NavLink
                            to="/trackinfo"
                            className={({ isActive, isPending }) =>
                                isPending ? 'pending' : isActive ? 'active' : ''
                            }
                        >
                            <ButtonNav>
                                <Discord height={24} width={24} />
                                Discord RPC
                            </ButtonNav>
                        </NavLink>
                        {/* <NavLink to="/theme" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                        <ButtonNav disabled>
                            <MdColorLens size={24} />
                            Стилизация
                        </ButtonNav>
                        {/* </NavLink> */}
                        {/* <NavLink to="/joint" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                        <ButtonNav disabled>
                            <MdConnectWithoutContact size={24} />
                            Совместное прослушивание
                        </ButtonNav>
                        {/* </NavLink> */}
                        <div className={styles.line}></div>
                        {/* <NavLink to="/other" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                        <ButtonNav disabled>
                            <MdArchitecture size={24} />
                            Остальное
                        </ButtonNav>
                        {/* </NavLink> */}
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout
