import React from 'react'
import styles from './container.module.scss'

interface p {
    className?: string
    children: any
}

const Container: React.FC<p> = ({ children, className }) => {
    return (
        <>
            <div className={`${styles.container} ${className}`}>{children}</div>
        </>
    )
}

export default Container
