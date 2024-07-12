import React from 'react'
import styles from './card.module.scss'
import Checkbox from '../checkbox'
import ThemeInterface from '../../api/interfaces/theme.interface'

interface Props {
    theme: ThemeInterface
    isChecked: boolean
    onCheckboxChange: (themeName: string, isChecked: boolean) => void
    children?: any
}

const ExtensionCard: React.FC<Props> = ({ theme, isChecked, onCheckboxChange, children }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <img
                    className={styles.icon}
                    src={theme.image ? theme.path + "\\" + theme.image : "https://cdn.discordapp.com/avatars/449211993585614849/6c9a8a2b2733b6ea468756e37ab5f7ff.png?size=4096"}
                    width="50"
                    height="50"
                    alt="Theme image"
                />
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>{theme.name}</h2>
                    <span className={styles.author}>{theme.author}</span>
                </div>
                <div className={styles.checkbox}>
                    <Checkbox
                        checkType="changeTheme"
                        isChecked={isChecked}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckboxChange(theme.name, e.target.checked)}
                    />
                </div>
            </div>
        </div>
    )
}

export default ExtensionCard
