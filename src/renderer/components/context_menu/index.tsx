import React, { useContext, useEffect, useState } from 'react'
import * as styles from './context_menu.module.scss'
import userContext from '../../api/context/user.context'

import ArrowContext from './../../../../static/assets/icons/arrowContext.svg'
import playerContext from '../../api/context/player.context'
import getTrackUrl from '../../api/createTrackUrl'
import hotToast from 'react-hot-toast'
import toast from '../../api/toast'
import trackInitials from '../../api/initials/track.initials'
import config from '../../api/config'
import getUserToken from '../../api/getUserToken'
import userInitials from '../../api/initials/user.initials'

interface ContextMenuProps {
    modalRef: React.RefObject<{ openModal: () => void; closeModal: () => void }>
}

interface ButtonConfig {
    key: string
    disabled: boolean
    onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void
    text: string
}

interface SectionConfig {
    title: string
    buttons: ButtonConfig[]
}

const ButtonGroup: React.FC<{ config: SectionConfig }> = ({ config }) => (
    <div className={styles.innerFunction}>
        {config.title}
        <ArrowContext />
        <div className={styles.showButtons}>
            {config.buttons.map(button => (
                <button
                    key={button.key}
                    className={styles.contextButton}
                    disabled={button.disabled}
                    onClick={button.onClick}
                >
                    {button.text}
                </button>
            ))}
        </div>
    </div>
)

const ContextMenu: React.FC<ContextMenuProps> = ({ modalRef }) => {
    const { app, yaClient, setApp, setUser, setUpdate } =
        useContext(userContext)
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
        setApp({
            ...app,
            settings: {
                ...app.settings,
                patched: false,
            },
        })
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
                window.electron.store.delete('tokens.token')
                setUser(userInitials)
            }
        })
    }
    const githubLink = () => {
        window.open(
            'https://github.com/PulseSync-LLC/YMusic-DRPC/tree/patcher-ts',
        )
    }
    const enableFunc = (type: string, status: boolean) => {
        switch (type) {
            case 'autoTray':
                setApp({
                    ...app,
                    settings: {
                        ...app.settings,
                        autoStartInTray: status,
                    },
                })
                window.electron.store.set('settings.autoStartInTray', status)
                break
            case 'autoStart':
                setApp({
                    ...app,
                    settings: {
                        ...app.settings,
                        autoStartApp: status,
                    },
                })
                window.electron.store.set('settings.autoStartApp', status)
                window.desktopEvents?.send('settings.autoStartApp', status)
                break
            case 'autoStartMusic':
                setApp({
                    ...app,
                    settings: {
                        ...app.settings,
                        autoStartMusic: status,
                    },
                })
                window.electron.store.set('settings.autoStartMusic', status)
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
                        background: '#292C36',
                        color: '#ffffff',
                        border: 'solid 1px #363944',
                        borderRadius: '8px',
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
                window.desktopEvents?.send('renderer-log', {
                    info: 'Download track failed: ' + e,
                })
                toast.error('Не удалось получить ссылку для трека')
            })

        window.desktopEvents?.removeAllListeners('download-track-progress')
    }
    const toastLoading = (event: any, title: string) => {
        let toastId: string
        toastId = hotToast.loading(title, {
            style: {
                background: '#292C36',
                color: '#ffffff',
                border: 'solid 1px #363944',
                borderRadius: '8px',
            },
        })
        const handleUpdateAppData = (event: any, data: any) => {
            for (const [key, value] of Object.entries(data)) {
                switch (key) {
                    case 'repatch':
                        toast.success('Успешный репатч', { id: toastId })
                        break
                    case 'depatch':
                        toast.success('Успешный депатч', { id: toastId })
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
    const buttonConfigs: SectionConfig[] = [
        {
            title: 'Патч',
            buttons: [
                { key: 'patch_button', disabled: false, onClick: () => { }, text: 'Патч' },
                { key: 'repatch_button', disabled: true, onClick: (e) => toastLoading(e, 'Репатч...'), text: 'Репатч' },
                { key: 'depatch_button', disabled: true, onClick: (e) => toastLoading(e, 'Депатч...'), text: 'Депатч' },
                { key: 'github_link', disabled: false, onClick: githubLink, text: 'Скрипт патчера на GitHub' }
            ]
        },
        {
            title: 'Автотрей',
            buttons: [
                { key: 'enable_autoTray', disabled: false, onClick: (e) => enableFunc('autoTray', true), text: 'Включить' },
                { key: 'disable_autoTray', disabled: true, onClick: (e) => enableFunc('autoTray', false), text: 'Выключить' }
            ]
        },
        {
            title: 'Автозапуск приложения',
            buttons: [
                { key: 'enable_autoStart', disabled: false, onClick: (e) => enableFunc('autoStart', true), text: 'Включить' },
                { key: 'disable_autoStart', disabled: true, onClick: (e) => enableFunc('autoStart', false), text: 'Выключить' }
            ]
        },
        {
            title: 'Автозапуск Яндекс Музыки',
            buttons: [
                { key: 'enable_autoStartMusic', disabled: true, onClick: (e) => enableFunc('autoStartMusic', true), text: 'Включить' },
                { key: 'disable_autoStartMusic', disabled: true, onClick: (e) => enableFunc('autoStartMusic', false), text: 'Выключить' }
            ]
        },
        {
            title: 'Звуки интерфейса',
            buttons: [
                { key: 'none', disabled: true, onClick: (e) => enableFunc('none', true), text: 'Включить' },
                { key: 'none', disabled: true, onClick: (e) => enableFunc('none', false), text: 'Выключить' }
            ]
        },
        {
            title: 'Размер интерфейса',
            buttons: [
                { key: 'size_interface', disabled: true, onClick: (e) => { }, text: 'Скоро' }
            ]
        },
        {
            title: 'Особое',
            buttons: [
                { key: 'beta_version', disabled: false, onClick: handleOpenModal, text: `Beta v${app.info.version}` },
                { key: 'check_update', disabled: false, onClick: () => window.desktopEvents?.send('checkUpdate'), text: 'Проверить обновления' },
                { key: 'download_track', disabled: currentTrack === trackInitials || currentTrack.id === '', onClick: downloadTrack, text: `Скачать ${currentTrack.playerBarTitle} в папку музыка` },
                { key: 'music_path', disabled: false, onClick: () => window.desktopEvents.send('openPath', 'musicPath'), text: 'Директория со скаченной музыкой' }
            ]
        }
    ]

    return (
        <div className={styles.patchMenu}>
            <button
                className={styles.contextButton}
                onClick={() => window.desktopEvents.send('openPath', 'appPath')}
            >
                Директория приложения
            </button>
            {buttonConfigs.map((config, index) => (
                <ButtonGroup key={index} config={config} />
            ))}
            <button className={styles.contextButton} onClick={logout}>
                Выйти
            </button>
        </div>
    )
}

export default ContextMenu
