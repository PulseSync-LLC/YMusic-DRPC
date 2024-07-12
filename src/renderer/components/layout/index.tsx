import styles from './layout.module.scss'
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { Helmet } from 'react-helmet'
import Header from './header'
import ButtonNav from '../button_nav'
import Discord from './../../../../static/assets/icons/discord.svg'
import {
    MdConnectWithoutContact,
    MdDownload,
    MdEngineering,
    MdExtension,
    MdStoreMallDirectory,
    MdWarning,
} from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import userContext from '../../api/context/user.context'
import SettingsInterface from '../../api/interfaces/settings.interface'
import Modal from '../modal'
import hotToast from 'react-hot-toast'
import toast from '../../api/toast'

interface p {
    title: string
    children: any
    goBack?: boolean
}

interface ModalContextType {
    openModal: () => void
    closeModal: () => void
}

export const ModalContext = createContext<ModalContextType>({
    openModal: () => {},
    closeModal: () => {},
})
const Layout: React.FC<p> = ({ title, children, goBack }) => {
    const { settings, setSettings, updateAvailable, setUpdate } =
        useContext(userContext)
    const toastLoading = (event: any, title: string) => {
        let toastId: string
        toastId = hotToast.loading(title, {
            style: {
                background: '#333',
                color: '#fff',
            },
        })
        const handleUpdateAppData = (event: any, data: any) => {
            for (const [key] of Object.entries(data)) {
                switch (key) {
                    case 'patch':
                        toast.success('Успешный патч', { id: toastId })
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
        if (typeof window !== 'undefined') {
            window.desktopEvents?.on('update-available', (event, data) => {
                setUpdate(true)
            })
        }
    }, [])
    return (
        <>
            <Helmet>
                <title>{title + ' - PulseSync'}</title>
            </Helmet>
            <div className={styles.children}>
                <Header goBack={goBack} />
                <div className={styles.main_window}>
                    <div className={styles.navigation_bar}>
                        <div className={styles.navigation_buttons}>
                            <NavLink
                                to="/trackinfo"
                                className={({ isActive, isPending }) =>
                                    isPending
                                        ? 'pending'
                                        : isActive
                                          ? 'active'
                                          : ''
                                }
                            >
                                <ButtonNav>
                                    <Discord height={24} width={24} />
                                </ButtonNav>
                            </NavLink>
                            <NavLink
                                to="/theme"
                                className={({ isActive, isPending }) =>
                                    isPending
                                        ? 'pending'
                                        : isActive
                                          ? 'active'
                                          : ''
                                }
                            >
                                <ButtonNav>
                                    <MdExtension size={24} />
                                </ButtonNav>
                            </NavLink>
                            <ButtonNav disabled>
                                <MdStoreMallDirectory size={24} />
                            </ButtonNav>
                            <ButtonNav disabled>
                                <MdConnectWithoutContact size={24} />
                            </ButtonNav>
                        </div>
                        {updateAvailable && (
                            <button
                                onClick={() => {
                                    setUpdate(false)
                                    window.desktopEvents?.send('update-install')
                                }}
                                className={styles.update_download}
                            >
                                <MdDownload size={24} />
                            </button>
                        )}
                    </div>

                    {!settings.patched && (
                        <div className={styles.alert_patch}>
                            <div>
                                <div>
                                    <div className={styles.container_warn}>
                                        <MdWarning size={38} />
                                        <div>
                                            У Яндекс Музыки отсутствует патч!
                                        </div>
                                    </div>
                                    <button
                                        onClick={e => {
                                            toastLoading(e, 'Патч...')
                                            window.electron.patcher.patch()
                                            setSettings(
                                                (
                                                    prevSettings: SettingsInterface,
                                                ) => ({
                                                    ...prevSettings,
                                                    patched: true,
                                                }),
                                            )
                                        }}
                                    >
                                        <MdEngineering size={22} /> Запатчить
                                    </button>
                                </div>
                                <img
                                    src="static\assets\images\O^O.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout
