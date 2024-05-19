import React from 'react'
import styles from './container.module.scss'

interface p {
    titleName: string
    className?: string
    imageName?: string
    children: any
}

const Container: React.FC<p> = ({ titleName, className, imageName, children }) => {
    return (
        <>
            <div className={`${styles.container} ${className}`}>
                <div className={styles.title_container}>
                    <img src={`static/assets/container_icons/${imageName}.svg`} alt={imageName} />
                    <div className={styles.title}>{titleName}</div>
                </div>
                {children}
            </div>
        </>
    )
}

export default Container
