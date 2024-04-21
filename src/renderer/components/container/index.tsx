import React from 'react'
import styles from './container.module.scss'

interface p {
    titleName: string
    className?: string
    children: any
}

const Container: React.FC<p> = ({ titleName, children, className }) => {
    return (
        <>
            <div className={`${styles.container} ${className}`}>
                <div className={styles.title}>{titleName}</div>
                {children}
            </div>
        </>
    )
}

export default Container
