import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'

import styles from '../../../../static/styles/page/index.module.scss'
import stylesBut from '../../components/button_default/button_default.module.scss'
import theme from './trackinfo.module.scss'

import { useContext, useEffect, useState } from 'react'
import userContext from '../../api/context/user.context'
import UserInterface from '../../api/interfaces/user.interface'
import userInitials from '../../api/interfaces/user.initials'
import TrackInterface from '../../api/interfaces/track.interface'
import trackInitials from '../../api/interfaces/track.initials'
import Skeleton from 'react-loading-skeleton'
import playerContext from '../../api/context/player.context'
import getTrackUrl from '../../api/createTrackUrl'
import hotToast from 'react-hot-toast'
import toast from '../../api/toast'
export default function TrackInfoPage() {
    const { user, setUser, socket, loading, settings, yaClient } =
        useContext(userContext)
    const { currentTrack } = useContext(playerContext)
    const downloadTrack = (event: any) => {
        event.stopPropagation()
        let toastId: string
        console.log(yaClient)
        getTrackUrl(yaClient, currentTrack.id, true)
            .then(_result => {
                toastId = hotToast.loading('Загрузка...', {
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                })

                window.desktopEvents?.on(
                    'download-track-progress',
                    (events, value) => {
                        console.log(Math.floor(value))
                        toast.loading(
                            <>
                                <span>Загрузка</span>
                                <b style={{ marginLeft: '.5em' }}>
                                    {Math.floor(value)}%
                                </b>
                            </>,
                            {
                                id: toastId,
                            },
                        )
                    },
                )

                window.electron.downloadTrack({
                    track: currentTrack,
                    url: _result,
                })

                window.desktopEvents?.once('download-track-cancelled', () =>
                    hotToast.dismiss(toastId),
                )
                window.desktopEvents?.once('download-track-failed', () =>
                    toast.error('Ошибка загрузки трека', { id: toastId }),
                )
                window.desktopEvents?.once('download-track-finished', () =>
                    toast.success('Загрузка завершена', { id: toastId }),
                )
            })
            .catch(e => {
                console.log(e)
                toast.error('Не удалось получить ссылку для трека')
            })

        window.desktopEvents?.removeAllListeners('download-track-progress')
    }
    return (
        <Layout title="Discord RPC">
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.main_container}>
                        <Container
                            titleName={'Discord RPC'}
                            imageName={'discord'}
                        >
                            <div className={theme.container}>
                                <div className={theme.discordRpcSettings}>
                                    <div className={theme.optionalContainer}>
                                        <div className={theme.optionalTitle}>
                                            Обзор
                                        </div>
                                        <CheckboxNav
                                            checkType="startDiscordRpc"
                                            description="Активируйте этот параметр, чтобы ваш текущий статус отображался в Discord."
                                        >
                                            Включить статус дискорд
                                        </CheckboxNav>
                                    </div>
                                    <div className={theme.line}></div>
                                    <div className={theme.optionalContainer}>
                                        <div className={theme.optionalTitle}>
                                            Настроить статус
                                        </div>
                                        <div
                                            className={theme.textInputContainer}
                                        >
                                            <div>Details</div>
                                            <input
                                                type="text"
                                                className={theme.styledInput}
                                            />
                                        </div>
                                        <div
                                            className={theme.textInputContainer}
                                        >
                                            <div>State</div>
                                            <input
                                                type="text"
                                                className={theme.styledInput}
                                            />
                                        </div>
                                        <div
                                            className={theme.textInputContainer}
                                        >
                                            <div>Button</div>
                                            <input
                                                type="text"
                                                className={theme.styledInput}
                                            />
                                        </div>
                                        <CheckboxNav
                                            checkType="enableRpcButtonListen"
                                            description="Активируйте этот параметр, чтобы ваш текущий статус отображался в Discord."
                                        >
                                            Включить кнопку (Слушать)
                                        </CheckboxNav>
                                    </div>
                                </div>
                                <div className={theme.discordRpc}>
                                    <img
                                        className={theme.userBanner}
                                        src={user.banner ? user.banner : "static/assets/images/no_banner.png"}
                                        alt=""
                                    />
                                    <div>
                                        <img
                                            className={theme.userAvatar}
                                            src={user.avatar}
                                            alt=""
                                        />
                                        <div className={theme.userName}>
                                            {user.username}
                                        </div>
                                        <div className={theme.userRPC}>
                                            <div className={theme.status}>
                                                Играет в игру
                                            </div>
                                            <div className={theme.statusRPC}>
                                                <div>
                                                    {settings.discordRpc &&
                                                    currentTrack !==
                                                        trackInitials ? (
                                                        <div
                                                            className={
                                                                theme.flex_container
                                                            }
                                                        >
                                                            <img
                                                                className={
                                                                    theme.img
                                                                }
                                                                src={
                                                                    currentTrack
                                                                        .requestImgTrack[1]
                                                                        ? currentTrack
                                                                              .requestImgTrack[1]
                                                                        : './static/assets/logo/logoappsummer.png'
                                                                }
                                                                alt=""
                                                            />
                                                            <div
                                                                className={
                                                                    theme.gap
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        theme.appName
                                                                    }
                                                                >
                                                                    PulseSync
                                                                </div>
                                                                <div
                                                                    className={
                                                                        theme.name
                                                                    }
                                                                >
                                                                    {
                                                                        currentTrack.playerBarTitle
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        currentTrack.artist
                                                                    }
                                                                </div>
                                                                <div
                                                                    className={
                                                                        theme.time
                                                                    }
                                                                >
                                                                    {
                                                                        currentTrack
                                                                            .timecodes[0]
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        currentTrack
                                                                            .timecodes[1]
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={
                                                                theme.flex_container
                                                            }
                                                        >
                                                            <Skeleton
                                                                width={58}
                                                                height={58}
                                                            />
                                                            <div
                                                                className={
                                                                    theme.gap
                                                                }
                                                            >
                                                                <Skeleton
                                                                    width={70}
                                                                    height={19}
                                                                />
                                                                <Skeleton
                                                                    width={190}
                                                                    height={16}
                                                                />
                                                                <Skeleton
                                                                    width={80}
                                                                    height={16}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={theme.button}>
                                                    Слушать трек на Яндекс
                                                    Музыке
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
