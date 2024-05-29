import Header from '../../components/layout/header'
import Container from '../../components/container'

import styles from './callback.module.scss'

import DiscordAuth from './../../../../static/assets/icons/discordAuth.svg'

export default function AuthPage() {
    return (
        <>
            <Header />
            <div className={styles.main_window}>
                <div>
                    <div className={styles.container}>
                        <DiscordAuth />
                        Ожидание авторизации
                    </div>
                </div>
            </div>
        </>
    )
}
