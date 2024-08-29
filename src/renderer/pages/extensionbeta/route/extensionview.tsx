import React from 'react'
import Layout from '../../../components/layout'
import Button from '../../../components/button'
import * as styles from '../../../../../static/styles/page/index.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import ThemeInterface from '../../../api/interfaces/theme.interface'

const ExtensionViewPage: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const theme = location.state?.theme as ThemeInterface

    if (!theme) {
        navigate('/extensionbeta')
        return null;
    }

    return (
        <Layout title="Стилизация">
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.main_container}>
                        <div className={styles.container30x15}>
                            <div>
                                <h1>{theme.name || 'Название недоступно'}</h1>
                                <img src={`${theme.path}/${theme.image}`} alt={`${theme.name} image`} width="100" height="100" />
                                {theme.author && <p>Автор: {theme.author}</p>}
                                {theme.description && <p>Описание: {theme.description}</p>}
                                {theme.version && <p>Версия: {theme.version}</p>}
                                {theme.lastModified && (
                                    <p>Последнее обновление: {theme.lastModified}</p>
                                )}
                                {theme.size !== undefined && <p>Размер: {theme.size} KB</p>}
                                {Array.isArray(theme.tags) && theme.tags.length > 0 && (
                                    <p>Теги: {theme.tags.join(', ')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ExtensionViewPage;
