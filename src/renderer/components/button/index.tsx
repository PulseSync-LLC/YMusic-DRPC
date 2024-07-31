import React, { ButtonHTMLAttributes, CSSProperties } from 'react'
import * as styles from './button.module.scss'

interface p extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void
    style?: CSSProperties
    children: any
}

const Button: React.FC<p> = ({ onClick, style, children }) => {
    return (
        <button className={styles.button} onClick={onClick} style={style}>
            {children}
        </button>
    )
}

export default Button
