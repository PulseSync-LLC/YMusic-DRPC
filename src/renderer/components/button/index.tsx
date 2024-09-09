import React, { ButtonHTMLAttributes, CSSProperties } from 'react';
import useSound from 'use-sound';
import buttonClick from './../../../../static/assets/sounds/v1buttonClick.wav';
import buttonHover from './../../../../static/assets/sounds/v1buttonHover.wav';
import buttonDisable from './../../../../static/assets/sounds/v2buttondisable.wav';
import * as styles from './button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    style?: CSSProperties;
    children: any;
    disableOnClickSound?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    style,
    children,
    disableOnClickSound = true,
    className,
    ...rest
}) => {
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
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            style={style}
            className={`${styles.button} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
