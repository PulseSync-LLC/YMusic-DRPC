import styles from './layout.module.scss'
import React from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'
import ButtonNav from '../button_nav'
import {
    MdConnectWithoutContact,
    MdDescription,
    MdHandyman,
    MdHeadset,
    MdHome,
    MdStyle,
} from 'react-icons/md'
import { NavLink } from 'react-router-dom'

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
                        {/* <NavLink to="/trackinfo" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                        <ButtonNav disabled>
                            <MdHeadset size={24} />
                            Информация о треке
                        </ButtonNav>
                        {/* </NavLink> */}
                        {/* <NavLink to="/theme" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                        <ButtonNav disabled>
                            <MdStyle size={24} />
                            Стилизация
                        </ButtonNav>
                        {/* </NavLink> */}
                        {/* <NavLink to="/script" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}> */}
                        <ButtonNav disabled>
                            <MdDescription size={24} />
                            Скриптинг
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
                            <MdHandyman size={24} />
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
