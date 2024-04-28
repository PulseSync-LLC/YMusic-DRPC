import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'
import ButtonDefault from '../../components/button_default'

import styles from '../../../../static/styles/page/index.module.scss'
import theme from './trackinfo.module.scss'

import { MdAirplay, MdDownload, MdVideoLibrary } from 'react-icons/md'
import { useContext, useEffect, useState } from 'react'
import userContext from '../../api/context/user.context'
import UserInterface from '../../api/interfaces/user.interface'
import userInitials from '../../api/interfaces/user.initials'
import TrackInterface from '../../api/interfaces/track.interface'
import trackInitials from '../../api/interfaces/track.initials'
import Skeleton from 'react-loading-skeleton'
export default function TrackInfoPage() {
    const { user, setUser, socket, loading } = useContext(userContext)
    const [track, setTrack] = useState<TrackInterface>(trackInitials)

    useEffect(() => {
        ;(async () => {
            if (user.socket_connected) {
                if (typeof window !== 'undefined') {
                    if (user.enableRpc) {
                        socket?.emit('ping')
                        socket?.on('trackinfo', data => {
                            setTrack(data)
                        })
                    } else {
                        socket?.off('trackinfo')
                        setTrack(trackInitials)
                    }
                }
            }
        })()
    }, [user])
    useEffect(() => {
        ;(async () => {
            if (user.socket_connected) {
                if (typeof window !== 'undefined') {
                    const timeRange =
                        track.timecodes.length === 2
                            ? `${track.timecodes[0]} - ${track.timecodes[1]}`
                            : ''
                    const details = track.artist
                        ? `${track.playerBarTitle} - ${track.artist}`
                        : track.playerBarTitle
                    const largeImage = track.requestImgTrack[1] || 'ym'
                    const smallImage = track.requestImgTrack[1] ? 'ym' : 'unset'
                    const buttons = 68413424
                        ? [
                              {
                                  label: '✌️ Open in YandexMusic',
                                  url: `yandexmusic://album/${encodeURIComponent(68413424)}`,
                              },
                          ]
                        : null
                    if (user.enableButtonListen) {
                        window.discordRpc.setActivity({
                            state: timeRange,
                            details: details,
                            largeImageKey: largeImage,
                            smallImageKey: smallImage,
                            smallImageText: 'Yandex Music',
                            buttons,
                        })
                    } else {
                        window.discordRpc.setActivity({
                            state: timeRange,
                            details: details,
                            largeImageKey: largeImage,
                            smallImageKey: smallImage,
                            smallImageText: 'Yandex Music',
                        })
                    }
                }
            }
        })()
    }, [track])
    return (
        <Layout title="Discord RPC">
            <div className={styles.page}>
                <Container titleName={'Discord RPC'}>
                    <div className={styles.container}>
                        <CheckboxNav checkType="startDiscordRpc">
                            <MdAirplay size={22} />
                            Включить статус дискорд
                        </CheckboxNav>
                        <div className={theme.container}>
                            {user.socket_connected ? (
                                <div className={theme.flex_container}>
                                    <img
                                        className={theme.img}
                                        src={
                                            track.requestImgTrack[1]
                                                ? track.requestImgTrack[1]
                                                : '../../../../static/assets/logo/logoapp.png'
                                        }
                                        alt=""
                                    />
                                    <div className={theme.gap}>
                                        <div className={theme.yndex}>
                                            Yandex Music
                                        </div>
                                        <div className={theme.name}>
                                            {track.playerBarTitle} -{' '}
                                            {track.artist}
                                        </div>
                                        <div className={theme.time}>
                                            {track.timecodes[0]} -{' '}
                                            {track.timecodes[1]}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Skeleton width={500} height={30} />
                                    <Skeleton
                                        width={400}
                                        height={20}
                                        style={{ marginTop: '10px' }}
                                    />
                                </div>
                            )}

                            <div className={theme.button}>Слушать</div>
                        </div>
                        <CheckboxNav checkType="enableButtonListen">
                            <MdVideoLibrary size={22} />
                            Включить кнопку (Слушать)
                        </CheckboxNav>
                        <ButtonDefault>
                            <MdDownload size={24} />
                            Скачать {'track name'} - {'track author'} в папку
                            музыка
                        </ButtonDefault>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
