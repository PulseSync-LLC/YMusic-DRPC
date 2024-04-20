import styles from './header.module.scss'
import React from 'react'
import { MdKeyboardBackspace } from 'react-icons/md'
import { motion } from 'framer-motion'

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    return (
        <>
            <header className={styles.header}>
                <div style={{ display: 'inline-flex' }}>
                    {goBack && (
                        <motion.div whileHover={{ scale: 0.9 }}>
                            <MdKeyboardBackspace
                                className={styles.btn}
                                size={25}
                                onClick={() => (window.location.hash = '/')}
                                style={{ marginRight: '1.3em' }}
                            />
                        </motion.div>
                    )}

                    <img
                        className={styles.logo}
                        src="static/assets/icon/icon.svg"
                        width={44}
                        onClick={() => (window.location.hash = '/')}
                        alt="Logo"
                    />
                </div>
            </header>
        </>
    )
}

export default Header
