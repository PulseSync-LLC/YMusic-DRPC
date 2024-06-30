import React from 'react'
import styles from './container.module.scss'

interface p {
    titleName: string
    className?: string
    imageName?: string
    buttonName?: string
    buttonEvent?: string
    children: any
}

const Container: React.FC<p> = ({
    titleName,
    className,
    imageName,
    children,
    buttonName,
    buttonEvent,
}) => {
    return (
        <>
            <div className={`${styles.container} ${className}`}>
                <div className={styles.title_container}>
                    <div className={styles.left}>
                        <img
                            src={`static/assets/container_icons/${imageName}.svg`}
                            alt={imageName}
                        />
                        <div className={styles.title}>{titleName}</div>
                    </div>
                    {buttonEvent && (
                        <button onClick={() => console.log(buttonEvent)}>
                            {buttonName}
                        </button>
                    )}
                </div>
                {children}
            </div>
        </>
    )
}

export default Container
