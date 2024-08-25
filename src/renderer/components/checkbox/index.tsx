import React, {
    ButtonHTMLAttributes,
    useContext,
    useEffect,
    useState,
} from 'react'
import * as styles from './checkbox.module.scss'
import userContext from '../../api/context/user.context'
import toggleOffSound from './../../../../static/assets/sounds/v1toggleOff.wav';
import toggleOnSound from './../../../../static/assets/sounds/v1toggleOn.wav';
import useSound from 'use-sound';

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
    const { app, setApp } = useContext(userContext)
    const [playToggleOff] = useSound(toggleOffSound);
    const [playToggleOn] = useSound(toggleOnSound);

    useEffect(() => {
        if (isChecked !== undefined) {
            setIsActive(isChecked)
        } else {
            switch (checkType) {
                case 'enableRpcButtonListen':
                    setIsActive(
                        window.electron.store.get(
                            'discordRpc.enableRpcButtonListen',
                        ),
                    )
                    break
                case 'enableGithubButton':
                    setIsActive(
                        window.electron.store.get(
                            'discordRpc.enableGithubButton',
                        ),
                    )
                    break
                case 'readPolicy':
                    setIsActive(
                        window.electron.store.get('settings.readPolicy'),
                    )
                    break
            }
        }
    }, [isChecked])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckedStatus = event.target.checked;

        if (newCheckedStatus) {
            playToggleOn();
        } else {
            playToggleOff();
        }

        setIsActive(event.target.checked)
        if (onChange) {
            onChange(event)
        } else {
            switch (checkType) {
                case 'enableRpcButtonListen':
                    window.electron.store.set(
                        'discordRpc.enableRpcButtonListen',
                        event.target.checked,
                    )
                    setApp({
                        ...app,
                        discordRpc: {
                            ...app.discordRpc,
                            enableRpcButtonListen: event.target.checked,
                        },
                    })
                    break
                case 'enableGithubButton':
                    window.electron.store.set(
                        'discordRpc.enableGithubButton',
                        event.target.checked,
                    )
                    setApp({
                        ...app,
                        discordRpc: {
                            ...app.discordRpc,
                            enableGithubButton: event.target.checked,
                        },
                    })
                    break
                case 'readPolicy':
                    setApp({
                        ...app,
                        settings: {
                            ...app.settings,
                            readPolicy: event.target.checked,
                        },
                    })
                    window.electron.store.set(
                        'settings.readPolicy',
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
