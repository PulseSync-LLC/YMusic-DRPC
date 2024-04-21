import styles from './layout.module.scss'
import React from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'
import ButtonNav from '../button'
import { MdHandyman } from 'react-icons/md'

interface p {
    title: string
    children: any
    goBack?: boolean
}

const active: React.CSSProperties = {
    background: '#2a2e34',
    border: '1px solid #3c434f',
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
                        <ButtonNav style={active}>
                            <MdHandyman size={24} />
                            Активная кнопка
                        </ButtonNav>
                        <ButtonNav>
                            <MdHandyman size={24} />
                            Просто кнопка
                        </ButtonNav>
                        <ButtonNav disabled>
                            <MdHandyman size={24} />
                            Disabled
                        </ButtonNav>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout
