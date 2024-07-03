import Header from '../../components/layout/header'
import Container from '../../components/container'

import styles from './callback.module.scss'

import DiscordAuth from './../../../../static/assets/icons/discordAuth.svg'
import {useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import userContext from '../../api/context/user.context'

export default function CallbackPage() {
    const navigate = useNavigate()
    const { user, settings, loading, authorize } = useContext(userContext)
    const [ banned, setBanned ] = useState(false)

    useEffect(() => {
        if (user.id !== '-1') {
            navigate('/trackinfo')
        }
    }, [user.id])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.desktopEvents?.on('authSuccess', (event, data) => {
                authorize()
            })
            window.desktopEvents?.on('authBanned', (event, data) => {
                setBanned(true)
                setTimeout(() => window.desktopEvents?.send("electron-exit"), 5000)
            })
        }
    }, [])
    return (
        <>
            <Header />
            <div className={styles.main_window}>
                <div>
                    <div className={styles.container}>
                        <DiscordAuth />
                        {!banned ? "Ожидание авторизацие" : "Вы забанены. Приложение закроется через 5 секунд"}
                    </div>
                </div>
            </div>
        </>
    )
}
