import React, {
    ButtonHTMLAttributes,
    CSSProperties,
    useEffect,
    useState,
} from 'react'
import styles from './checkbox.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: any
    disabled?: boolean
    checkType?: string
}

const Checkbox: React.FC<Props> = ({ children, disabled, checkType }) => {
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        switch (checkType) {
            case 'autoStartMusic':
                setIsActive(window.electron.store.get('autoStartMusic'))
                break
            case 'startDiscordRpc':
                setIsActive(window.electron.store.get('discordRpc'))
                break
        }
    }, [])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsActive(event.target.checked)
        switch (checkType) {
            case 'autoStartMusic':
                window.electron.autoStartMusic(event.target.checked)
                break
            case 'startDiscordRpc':
                window.discordRpc.enableRpc(event.target.checked)
                break
        }
    }

    return (
        <label
            className={`${styles.checkbox} ${isActive ? styles.active : ''}`}
        >
            <div className={styles.children_content}>{children}</div>
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
