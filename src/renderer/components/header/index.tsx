import React from "react"
import styles from './header.module.scss'

const Header: React.FC = () => {
    return (
        <div className={styles.navbar}>
            dfsf
            {/* <div className={styles.logoplace}>
                <img className={styles.logoapp} src="assets/logoapp.png" alt="" />
                <span>YMusic DRPC</span>
            </div>
            <div>
                <button id="minimize" className={styles.button_title}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_2_24)">
                            <path d="M5.5 12.5H19.5" stroke="var(--color1)" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2_24">
                                <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
                <button id="close" className={styles.button_title}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_2_26)">
                            <path d="M18.5 6.5L6.5 18.5" stroke="var(--color1)" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M6.5 6.5L18.5 18.5" stroke="var(--color1)" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2_26">
                                <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div> */}
        </div>
    )
}

export default Header