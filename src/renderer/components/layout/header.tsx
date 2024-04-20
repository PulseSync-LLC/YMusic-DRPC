import styles from './header.module.scss'
import React from 'react'
import { MdKeyboardBackspace } from 'react-icons/md'
import { motion } from 'framer-motion'

// import Minus from "@/static/assets/icons/minus.svg?inline"

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    return (
        <>
            <header className={styles.nav_bar}>
                <div className={styles.fix_size}>
                    <div className={styles.logoplace}>
                        <img className={styles.logoapp} src="static/assets/logo/logoapp.png" alt="" />
                        <span>PulseSync</span>
                    </div>
                    <div className={styles.button_container}>
                        <button id="hide" className={styles.button_title}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_280_1173)">
                                    <path d="M5 12H19" stroke="#CADBF4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_280_1173">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button id="minimize" className={styles.button_title}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_280_1175)">
                                    <path d="M14.1429 8.78571H6.64287C6.05114 8.78571 5.57144 9.2654 5.57144 9.85713V17.3571C5.57144 17.9489 6.05114 18.4286 6.64287 18.4286H14.1429C14.7346 18.4286 15.2143 17.9489 15.2143 17.3571V9.85713C15.2143 9.2654 14.7346 8.78571 14.1429 8.78571Z" stroke="#CADBF4" stroke-width="2" />
                                    <path d="M6.64285 5.57141H15.2143C16.9895 5.57141 18.4286 7.0105 18.4286 8.7857V17.3571" stroke="#CADBF4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_280_1175">
                                        <rect width="15" height="15" fill="white" transform="translate(4.5 4.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button id="close" className={styles.button_title}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_280_1180)">
                                    <path d="M18 6L6 18" stroke="#CADBF4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M6 6L18 18" stroke="#CADBF4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_280_1180">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
