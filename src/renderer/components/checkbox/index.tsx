import React, {
    ButtonHTMLAttributes,
    useContext,
    useEffect,
    useState,
} from 'react'
import styles from './checkbox.module.scss'
import userContext from '../../api/context/user.context'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: any
    disabled?: boolean
    description?: string
    checkType?: string
    isChecked?: boolean
    onChange?: (event: any) => void
}

const Checkbox: React.FC<Props> = ({
    children,
    disabled,
    description,
    checkType,
    isChecked,
    onChange,
}) => {
    const [isActive, setIsActive] = useState(false)
    const { setSettings } = useContext(userContext)
    useEffect(() => {
        if (isChecked !== undefined) {
            setIsActive(isChecked)
        } else {
            switch (checkType) {
                case 'startDiscordRpc':
                    setIsActive(window.electron.store.get('discordRpc'))
                    break
                case 'enableRpcButtonListen':
                    setIsActive(
                        window.electron.store.get('enableRpcButtonListen'),
                    )
                    break
                case 'readPolicy':
                    setIsActive(window.electron.store.get('readPolicy'))
                    break
            }
        }
    }, [isChecked])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsActive(event.target.checked)
        if (onChange) {
            onChange(event)
        } else {
            switch (checkType) {
                case 'startDiscordRpc':
                    window.discordRpc.discordRpc(event.target.checked)
                    setSettings((prevSettings: any) => ({
                        ...prevSettings,
                        discordRpc: event.target.checked,
                    }))
                    break
                case 'enableRpcButtonListen':
                    window.discordRpc.enableListenButton(event.target.checked)
                    setSettings((prevSettings: any) => ({
                        ...prevSettings,
                        enableRpcButtonListen: event.target.checked,
                    }))
                    break
                case 'readPolicy':
                    setSettings((prevSettings: any) => ({
                        ...prevSettings,
                        readPolicy: event.target.checked,
                    }))
                    window.electron.store.set(
                        'readPolicy',
                        event.target.checked,
                    )
                    break
            }
        }
    }

    return (
        <label
            className={`${styles.checkbox} ${isActive ? styles.active : ''}`}
        >
            <div className={styles.checkboxInner}>
                <div className={styles.children_content}>{children}</div>
                <input
                    className={`${styles.input_checkbox}`}
                    disabled={disabled}
                    type="checkbox"
                    checked={isActive}
                    name="checkbox-checked"
                    onChange={handleInputChange}
                />
                <div className={styles.custom_checkbox}>
                    <div className={styles.checkbox_slider}></div>
                </div>
            </div>
            <div className={styles.description}>{description}</div>
        </label>
    )
}

export default Checkbox
