import React, {
    ButtonHTMLAttributes,
    CSSProperties,
    useContext,
    useEffect,
    useState,
} from 'react'
import styles from './checkbox.module.scss'
import toast from '../../api/toast'
import userContext from '../../api/context/user.context'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: any
    disabled?: boolean
    checkType?: string
}

const Checkbox: React.FC<Props> = ({ children, disabled, checkType }) => {
    const [isActive, setIsActive] = useState(false)
    const { user, setUser, settings, setSettings } = useContext(userContext)
    useEffect(() => {
        switch (checkType) {
            case 'autoStartMusic':
                setIsActive(window.electron.store.get('autoStartMusic'))
                break
            case 'autoStartInTray':
                setIsActive(window.electron.store.get('autoStartInTray'))
                break
            case 'startDiscordRpc':
                setIsActive(window.electron.store.get('discordRpc'))
                break
            case 'enableRpcButtonListen':
                setIsActive(window.electron.store.get('enableRpcButtonListen'))
                break
            case 'readPolicy':
                setIsActive(window.electron.store.get('readPolicy'))
                break
        }
    }, [])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsActive(event.target.checked)
        switch (checkType) {
            case 'autoStartMusic':
                window.electron.autoStartMusic(event.target.checked)
                setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    autoStartMusic: event.target.checked,
                }))
                break
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
                window.electron.store.set('readPolicy', event.target.checked)
                break
            case 'autoStartInTray':
                setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    autoStartInTray: event.target.checked,
                }))
                window.electron.store.set(
                    'autoStartInTray',
                    event.target.checked,
                )
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
