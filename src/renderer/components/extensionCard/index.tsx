import React, { CSSProperties, useState, useEffect } from 'react'
import * as styles from './card.module.scss'
import Checkbox from '../checkbox'
import ThemeInterface from '../../api/interfaces/theme.interface'
import { MdDateRange, MdDesignServices, MdFolder, MdStar } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface Props {
    theme: ThemeInterface
    isChecked: boolean
    onCheckboxChange: (themeName: string, isChecked: boolean) => void
    children?: any
    className?: string
    style?: CSSProperties
}

const ExtensionCard: React.FC<Props> = ({
    theme,
    isChecked,
    onCheckboxChange,
    children,
    className,
    style,
}) => {
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState('static/assets/images/no_themeImage.png');

    const getUserImage = () => {
        fetch(`${theme.path}/${theme.image}`)
            .then((res) => {
                if (res.ok) {
                    setImageSrc(res.url);
                }
            })
            .catch(() => {
                setImageSrc('static/assets/images/no_themeImage.png');
            });
    };

    useEffect(() => {
        if (theme.path && theme.image) {
            getUserImage();
        }
    }, [theme]);

    const handleClick = () => {
        navigate(`/extensionbeta/${theme.name}`, { state: { theme } });
    };

    return (
        <div className={`${className} ${styles.card}`} onClick={handleClick} style={style}>
            <div className={styles.cardContainer}>
                <div className={styles.containerDetail}>
                    <img
                        className={styles.icon}
                        src={imageSrc}
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
