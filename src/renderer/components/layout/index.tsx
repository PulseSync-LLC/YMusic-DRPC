import styles from './layout.module.scss'
import React from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'
import ButtonNav from '../button'
import { MdHandyman, MdStyle } from 'react-icons/md'
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
                        <NavLink to="/" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}>
                            <ButtonNav>
                                <MdHandyman size={24} />
                                Основные настройки
                            </ButtonNav>
                        </NavLink>
                        <NavLink to="/theme" className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""}>
                            <ButtonNav>
                                <MdStyle size={24} />
                                Стилизация
                            </ButtonNav>
                        </NavLink>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout
