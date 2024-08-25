import React, { ButtonHTMLAttributes, CSSProperties, useState, useEffect } from 'react';
import useSound from 'use-sound';
import buttonClick from './../../../../static/assets/sounds/v1buttonClick.wav';
import buttonHover from './../../../../static/assets/sounds/v1buttonHover.wav';
import buttonDisable from './../../../../static/assets/sounds/v2buttondisable.wav';
import * as styles from './button.module.scss';

interface p extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    style?: CSSProperties;
    children: any;
    disableOnClickSound?: boolean;
}

const Button: React.FC<p> = ({ onClick, style, children, disableOnClickSound = true }) => {
    const [playClick] = useSound(buttonClick);
    const [playHover] = useSound(buttonHover);
    const [playDisable] = useSound(buttonDisable);

    const handleMouseEnter = () => {
        playHover();
    };

    const handleClick = () => {
        if (!disableOnClickSound) {
            playDisable();
        } else {
            playClick();
        }

        if (onClick) onClick();
    };

    return (
        <button
            className={styles.button}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            style={style}
        >
            {children}
        </button>
    );
};

export default Button;
