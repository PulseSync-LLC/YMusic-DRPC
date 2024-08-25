import React from 'react';
import { NavLink } from 'react-router-dom';
import useSound from 'use-sound';
import generalClick from './../../../../static/assets/sounds/v1buttonClick.wav';
import generalHover from './../../../../static/assets/sounds/v1generalHover.wav';
import * as styles from './nav_button_pulse.module.scss';

interface NavButtonPulseProps {
    to: string;
    children: React.ReactNode;
    disabled?: boolean;
}

const NavButtonPulse: React.FC<NavButtonPulseProps> = ({ to, children, disabled = false }) => {
    const [playClick] = useSound(generalClick);
    const [playHover] = useSound(generalHover);

    const handleMouseEnter = () => {
        if (!disabled) {
            playHover();
        }
    };

    const handleClick = () => {
        if (!disabled) {
            playClick();
        }
    };

    return (
        <NavLink
            to={to}
            className={({ isActive, isPending }) =>
                isPending
                    ? 'pending'
                    : isActive
                        ? 'active'
                        : ''
            }
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            <button
                className={styles.button}
                disabled={disabled}
            >
                {children}
            </button>
        </NavLink>
    );
};

export default NavButtonPulse;
