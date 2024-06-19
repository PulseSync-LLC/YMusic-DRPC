import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'
import ButtonDefault from '../../components/button_default'

import styles from '../../../../static/styles/page/index.module.scss'
import stylesBut from '../../components/button_default/button_default.module.scss'
import theme from './trackinfo.module.scss'

import {
    MdDownload,
    MdFolderOpen,
    MdSmartButton,
    MdVideogameAsset,
} from 'react-icons/md'
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
                <Container titleName={'Discord RPC'} imageName={'discord'}>
                    <div className={styles.container}>
                        <CheckboxNav checkType="startDiscordRpc">
                            <MdVideogameAsset size={22} />
                            Включить статус дискорд
                        </CheckboxNav>
                        <div className={theme.container}>
                            {settings.discordRpc &&
                            currentTrack !== trackInitials ? (
                                <div className={theme.flex_container}>
                                    <img
                                        className={theme.img}
                                        src={
                                            currentTrack.requestImgTrack[1]
                                                ? currentTrack
                                                      .requestImgTrack[1]
                                                : './static/assets/logo/logoappsummer.png'
                                        }
                                        alt=""
                                    />
                                    <div className={theme.gap}>
                                        <div className={theme.yndex}>
                                            Yandex Music
                                        </div>
                                        <div className={theme.name}>
                                            {currentTrack.playerBarTitle} -{' '}
                                            {currentTrack.artist}
                                        </div>
                                        <div className={theme.time}>
                                            {currentTrack.timecodes[0]} -{' '}
                                            {currentTrack.timecodes[1]}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Skeleton width={300} height={30} />
                                    <Skeleton
                                        width={300}
                                        height={20}
                                        style={{ marginTop: '10px' }}
                                    />
                                </div>
                            )}

                            <div className={theme.button}>
                                Слушать трек на Яндекс Музыке
                            </div>
                        </div>
                        <CheckboxNav checkType="enableRpcButtonListen">
                            <MdSmartButton size={22} />
                            Включить кнопку (Слушать)
                        </CheckboxNav>
                        <button
                            className={stylesBut.button}
                            onClick={downloadTrack}
                            disabled={
                                user.perms !== 'developer' ||
                                currentTrack === trackInitials ||
                                currentTrack.id === ''
                            }
                        >
                            <MdDownload size={22} />
                            Скачать {currentTrack.playerBarTitle} -{' '}
                            {currentTrack.artist} в папку музыка
                        </button>
                        <ButtonDefault disabled>
                            <MdFolderOpen size={22} />
                            Директория со скаченной музыкой
                        </ButtonDefault>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
