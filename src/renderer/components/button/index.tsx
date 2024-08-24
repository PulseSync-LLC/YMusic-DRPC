import React, { ButtonHTMLAttributes, CSSProperties } from 'react';
import useSound from 'use-sound';
import buttonClick from './../../../../static/assets/sounds/v1buttonClick.wav';
import buttonHover from './../../../../static/assets/sounds/v1buttonHover.wav';
import * as styles from './button.module.scss';

interface p extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    style?: CSSProperties;
    children: any;
}

const Button: React.FC<p> = ({ onClick, style, children }) => {
    const [playClick] = useSound(buttonClick);
    const [playHover] = useSound(buttonHover);

    const handleMouseEnter = () => {
        playHover();
    };

    return (
        <button
            className={styles.button}
            onClick={() => {
                playClick();
                if (onClick) onClick();
            }}
            onMouseEnter={handleMouseEnter}
            style={style}
        >
            {children}
        </button>
    );
};

export default Button;
