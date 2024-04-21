import React, { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import styles from './button_pather.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void
    icon: ReactNode
    text: string
    disabled?: boolean
}

const Button: React.FC<Props> = ({ onClick, icon, text, disabled }) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
        >
            <div className={styles.icon_box}>
                {icon}
            </div>
            {text}
        </button>
    )
}

export default Button
