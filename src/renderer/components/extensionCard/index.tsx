import React from 'react'
import styles from './card.module.scss'
import Checkbox from '../checkbox'
import ThemeInterface from '../../api/interfaces/theme.interface'
import { MdDateRange, MdDesignServices, MdFolder, MdStar } from 'react-icons/md'

interface Props {
    theme: ThemeInterface
    isChecked: boolean
    onCheckboxChange: (themeName: string, isChecked: boolean) => void
    children?: any
}

const ExtensionCard: React.FC<Props> = ({
    theme,
    isChecked,
    onCheckboxChange,
    children,
}) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardContainer}>
                <div className={styles.containerDetail}>
                    <img
                        className={styles.icon}
                        src={
                            theme.image
                                ? theme.path + '\\' + theme.image
                                : 'https://cdn.discordapp.com/avatars/449211993585614849/6c9a8a2b2733b6ea468756e37ab5f7ff.png?size=4096'
                        }
                        width="50"
                        height="50"
                        alt="Theme image"
                    />
                    <div className={styles.themeDetals}>
                        <span className={styles.title}>{theme.name}</span>
                        <span className={styles.author}>{theme.author}</span>
                    </div>
                </div>
                <div className={styles.themeVerStar}>
                    <div className={styles.tabDetail}>
                        <MdDesignServices size={20} />
                        ver. {theme.version}
                    </div>
                    <div className={styles.star}>
                        <MdStar size={20} /> Null
                    </div>
                </div>
            </div>
            <div className={styles.cardContainerTab}>
                <div className={styles.leftTab}>
                    <Checkbox
                        checkType="changeTheme"
                        isChecked={isChecked}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onCheckboxChange(theme.name, e.target.checked)
                        }
                    />
                    <div className={styles.tabDetail}>
                        <MdFolder size={20} />
                        {theme.size}
                    </div>
                </div>
                <div className={styles.tabDetail}>
                    <MdDateRange size={20} />
                    {theme.lastModified} (local)
                </div>
            </div>
        </div>
    )
}

export default ExtensionCard
