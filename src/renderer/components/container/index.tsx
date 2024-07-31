import React from 'react'
import * as styles from './container.module.scss'

interface p {
    titleName: string
    className?: string
    imageName?: string
    buttonName?: string
    onClick?: () => void
    children: any
}

const Container: React.FC<p> = ({
    titleName,
    className,
    imageName,
    children,
    buttonName,
    onClick,
}) => {
    return (
        <>
            <div
                className={`${styles.container} ${className ? className : ''}`}
            >
                <div className={styles.title_container}>
                    <div className={styles.left}>
                        <img
                            src={`static/assets/container_icons/${imageName}.svg`}
                            alt={imageName}
                        />
                        <div className={styles.title}>{titleName}</div>
                    </div>
                    {onClick && <button onClick={onClick}>{buttonName}</button>}
                </div>
                {children}
            </div>
        </>
    )
}

export default Container
