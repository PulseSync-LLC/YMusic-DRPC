import React from 'react';
import styles from './context_menu.module.scss';

const ContextMenu: React.FC = () => {
    return (
        <div className={styles.patchMenu}>
            <button>ПАТЧ</button>
            <button>РЕПАТЧ</button>
            <button>ДЕПАТЧ</button>
            <button className={styles.hyperLink}>СКРИПТ ПАТЧЕРА НА GITHUB</button>
        </div>
    );
};

export default ContextMenu;
