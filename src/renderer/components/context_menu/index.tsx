import React from 'react';
import './context_menu.module.scss';

const ContextMenu: React.FC = () => {
    return (
        <div className="patch-menu">
            <ul>
                <li>ПАТЧ</li>
                <li>РЕПАТЧ</li>
                <li>ДЕПАТЧ</li>
                <li><a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">СКРИПТ ПАТЧЕРА НА GITHUB</a></li>
            </ul>
        </div>
    );
};

export default ContextMenu;
