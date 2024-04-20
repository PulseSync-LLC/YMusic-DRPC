import styles from './layout.module.scss'
import React from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'

interface p {
    title: string
    children: any
    goBack?: boolean
}

const Layout: React.FC<p> = ({ title, children, goBack }) => {
    return (
        <>
            <Helmet>
                <title>{title + ' - YMusic-DRPC'}</title>
            </Helmet>

            <div className={styles.children}>
                <Header goBack={goBack} />

                {children}
            </div>
        </>
    )
}

export default Layout
