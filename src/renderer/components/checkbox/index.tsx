import React, { ButtonHTMLAttributes, CSSProperties, useState } from 'react'
import styles from './checkbox.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: any
    disabled?: boolean
}

const Checkbox: React.FC<Props> = ({ children, disabled }) => {
    const [isActive, setIsActive] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsActive(event.target.checked);
    };

    return (
        <label className={`${styles.checkbox} ${isActive ? styles.active : ''}`}>
            <div className={styles.children_content}>
                {children}
            </div>
            <input
                className={`${styles.input_checkbox}`}
                disabled={disabled}
                type="checkbox"
                name="checkbox-checked"
                onChange={handleInputChange}
            />
            <div className={styles.custom_checkbox}>
                <div className={styles.checkbox_slider}></div>
            </div>
        </label>
    )
}

export default Checkbox
