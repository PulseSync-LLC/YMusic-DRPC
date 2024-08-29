import React, { CSSProperties, useState, useEffect } from 'react';
import * as styles from './card.module.scss';
import Checkbox from '../checkbox';
import ThemeInterface from '../../api/interfaces/theme.interface';
import { MdDateRange, MdDesignServices, MdFolder, MdStar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface Props {
    theme: ThemeInterface;
    isChecked: boolean;
    onCheckboxChange: (themeName: string, isChecked: boolean) => void;
    children?: any;
    className?: string;
    style?: CSSProperties;
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
    const [bannerSrc, setBannerSrc] = useState('static/assets/images/no_themeImage.png');

    const formatPath = (path: string) => {
        return encodeURI(path.replace(/\\/g, '/'));
    };

    useEffect(() => {
        if (theme.path && theme.image) {
            const imgSrc = formatPath(`${theme.path}/${theme.image}`);
            fetch(imgSrc)
                .then((res) => {
                    if (res.ok) {
                        setImageSrc(imgSrc);
                    }
                })
                .catch(() => {
                    setImageSrc('static/assets/images/no_themeImage.png');
                });
        }
    }, [theme]);

    useEffect(() => {
        if (theme.path && theme.banner) {
            const bannerPath = formatPath(`${theme.path}/${theme.banner}`);
            fetch(bannerPath)
                .then((res) => {
                    if (res.ok) {
                        setBannerSrc(bannerPath);
                    }
                })
                .catch(() => {
                    setBannerSrc('static/assets/images/no_themeImage.png');
                });
        }
    }, [theme]);

    const handleClick = () => {
        navigate(`/extensionbeta/${theme.name}`, { state: { theme } });
    };

    return (
        <div
            className={`${className} ${styles.extensionCard}`}
            onClick={handleClick}
            style={{
                background: `linear-gradient(0deg, #292C36 0%, rgba(41, 44, 54, 0.9) 100%), url(${bannerSrc})`,
                backgroundSize: 'cover',
            }}
        >
            <div className={styles.imageOverlay}>
                <div className={styles.leftOrig}>
                    <img className={styles.themeImage} src={imageSrc} alt="Theme image" />
                    <div className={styles.detailTop}>
                        <span className={styles.themeTitle}>{theme.name}</span>
                        <span className={styles.themeAuthor}>By {theme.author}</span>
                    </div>
                </div>
                <div className={styles.rightOrig}>
                    (local) ver. {theme.version}
                </div>
            </div>
            <span className={styles.themeDescription}>
                {theme.description}
            </span>
        </div>
    );
};

export default ExtensionCard;
