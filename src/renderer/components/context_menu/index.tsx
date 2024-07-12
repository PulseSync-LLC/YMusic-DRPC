import React, { useContext, useEffect, useState } from 'react'
import styles from './context_menu.module.scss'
import userContext from '../../api/context/user.context'
import { shell } from 'electron'
import SettingsInterface from '../../api/interfaces/settings.interface'

import ArrowContext from './../../../../static/assets/icons/arrowContext.svg'
import playerContext from '../../api/context/player.context'
import getTrackUrl from '../../api/createTrackUrl'
import hotToast from 'react-hot-toast'
import toast from '../../api/toast'
import trackInitials from '../../api/interfaces/track.initials'
import config from '../../api/config'
import getUserToken from '../../api/getUserToken'
import userInitials from '../../api/interfaces/user.initials'
import { ModalContext } from '../layout'

interface ContextMenuProps {
    modalRef: React.RefObject<{ openModal: () => void; closeModal: () => void }>
}

const ContextMenu: React.FC<ContextMenuProps> = ({ modalRef }) => {
    const { settings, yaClient, setSettings, setUser, setUpdate } =
        useContext(userContext)
    const [version, setVersion] = useState(null)
    const { currentTrack } = useContext(playerContext)
    const handleOpenModal = () => {
        if (modalRef.current) {
            modalRef.current.openModal()
        }
    }
    const repatch = () => {
        window.electron.patcher.repatch()
    }
    const depatch = () => {
        window.electron.patcher.depatch()
        setSettings((prevSettings: SettingsInterface) => ({
            ...prevSettings,
            patched: false,
        }))
    }
    const logout = () => {
        fetch(config.SERVER_URL + 'auth/logout', {
            method: 'PUT',
            headers: {
                authorization: 'Bearer: ' + getUserToken(),
            },
        }).then(async r => {
            const res = await r.json()
            if (res.ok) {
                toast.success('Успешный выход')
                window.electron.store.delete('token')
                setUser(userInitials)
            }
        })
    }
    const githubLink = () => {
        window.open(
            'https://github.com/PulseSync-Official/YMusic-DRPC/tree/patcher-ts',
        )
    }
    const enableFunc = (type: string, status: boolean) => {
        switch (type) {
            case 'autoTray':
                setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    autoStartInTray: status,
                }))
                window.electron.store.set('autoStartInTray', status)
                break
            case 'autoStart':
                setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    autoStartApp: status,
                }))
                window.electron.store.set('autoStartApp', status)
                window.desktopEvents?.send('autoStartApp', status)
                break
            case 'autoStartMusic':
                setSettings((prevSettings: any) => ({
                    ...prevSettings,
                    autoStartMusic: status,
                }))
                window.electron.store.set('autoStartMusic', status)
                break
        }
    }
    const downloadTrack = (event: any) => {
        event.stopPropagation()
        let toastId: string
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
                    (event, value) => {
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
    const toastLoading = (event: any, title: string) => {
        let toastId: string
        toastId = hotToast.loading(title, {
            style: {
                background: '#394045',
                color: '#DDF2FF',
                border: 'solid 1px #535A5F',
                borderRadius: '32px',
            },
        })
        const handleUpdateAppData = (event: any, data: any) => {
            for (const [key, value] of Object.entries(data)) {
                console.log(key)
                switch (key) {
                    case 'repatch':
                        toast.success('Успешный репатч', { id: toastId })
                        break
                    case 'depatch':
                        toast.success('Успешный депатч', { id: toastId })
                        break
                    case 'update':
                        if (value) {
                            toast.success('Обновления найдены', { id: toastId })
                        } else {
                            toast.error('Обновления не найдены', {
                                id: toastId,
                            })
                        }
                        break
                    default:
                        hotToast.dismiss(toastId)
                        break
                }
            }
            window.desktopEvents?.removeAllListeners('UPDATE_APP_DATA')
        }

        window.desktopEvents?.on('UPDATE_APP_DATA', handleUpdateAppData)
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && window.desktopEvents) {
            window.desktopEvents
                ?.invoke('getVersion')
                .then((version: string | undefined) => {
                    setVersion(version)
                })
        }
    }, [])
    return (
        <div className={styles.patchMenu}>
            <button
                className={styles.contextButton}
                onClick={() => {
                    window.desktopEvents.send('openPath', 'appPath')
                }}
            >
                Директория приложения
            </button>
            <div className={styles.innerFunction}>
                Патч
                <ArrowContext />
                <div className={styles.showButtons}>
                    <button
                        key="patch_button"
                        disabled={settings.patched}
                        className={styles.contextButton}
                    >
                        Патч
                    </button>
                    <button
                        onClick={e => {
                            toastLoading(e, 'Репатч...')
                            repatch()
                        }}
                        key="repatch_button"
                        disabled={!settings.patched}
                        className={styles.contextButton}
                    >
                        Репатч
                    </button>
                    <button
                        onClick={e => {
                            toastLoading(e, 'Депатч...')
                            depatch()
                        }}
                        key="depatch_button"
                        disabled={!settings.patched}
                        className={styles.contextButton}
                    >
                        Депатч
                    </button>
                    <button
                        onClick={githubLink}
                        className={styles.contextButton}
                    >
                        Скрипт патчера на GitHub
                    </button>
                </div>
            </div>
            <div className={styles.innerFunction}>
                Автотрей
                <ArrowContext />
                <div className={styles.showButtons}>
                    <button
                        className={styles.contextButton}
                        disabled={settings.autoStartInTray}
                        onClick={() => enableFunc('autoTray', true)}
                    >
                        Включить
                    </button>
                    <button
                        className={styles.contextButton}
                        disabled={!settings.autoStartInTray}
                        onClick={() => enableFunc('autoTray', false)}
                    >
                        Выключить
                    </button>
                </div>
            </div>
            <div className={styles.innerFunction}>
                Автозапуск приложения
                <ArrowContext />
                <div className={styles.showButtons}>
                    <button
                        className={styles.contextButton}
                        disabled={settings.autoStartApp}
                        onClick={() => enableFunc('autoStart', true)}
                    >
                        Включить
                    </button>
                    <button
                        className={styles.contextButton}
                        disabled={!settings.autoStartApp}
                        onClick={() => enableFunc('autoStart', false)}
                    >
                        Выключить
                    </button>
                </div>
            </div>
            <div className={styles.innerFunction}>
                Автозапуск Яндекс Музыки
                <ArrowContext />
                <div className={styles.showButtons}>
                    <button
                        className={styles.contextButton}
                        disabled={settings.autoStartMusic}
                        onClick={() => enableFunc('autoStartMusic', true)}
                    >
                        Включить
                    </button>
                    <button
                        className={styles.contextButton}
                        disabled={!settings.autoStartMusic}
                        onClick={() => enableFunc('autoStartMusic', false)}
                    >
                        Выключить
                    </button>
                </div>
            </div>
            <div className={styles.innerFunction}>
                Размер интерфейса
                <ArrowContext />
                <div className={styles.showButtons}>
                    <button className={styles.contextButton} disabled>
                        Скоро
                    </button>
                </div>
            </div>
            <div className={styles.innerFunction}>
                Особое
                <ArrowContext />
                <div className={styles.showButtons}>
                    <div
                        className={styles.contextButton}
                        onClick={handleOpenModal}
                    >
                        Beta v{version}
                    </div>
                    <button
                        className={styles.contextButton}
                        onClick={e => {
                            toastLoading(e, 'Поиск обновлений')
                            window.desktopEvents?.send('checkUpdate')
                        }}
                    >
                        Проверить обновления
                    </button>
                    <button
                        className={styles.contextButton}
                        onClick={downloadTrack}
                        disabled={
                            currentTrack === trackInitials ||
                            currentTrack.id === ''
                        }
                    >
                        Скачать {currentTrack.playerBarTitle} в папку музыка
                    </button>
                    <button
                        className={styles.contextButton}
                        onClick={() => {
                            window.desktopEvents.send('openPath', 'musicPath')
                        }}
                    >
                        Директория со скаченной музыкой
                    </button>
                </div>
            </div>
            <button className={styles.contextButton} onClick={logout}>
                Выйти
            </button>
        </div>
    )
}

export default ContextMenu
