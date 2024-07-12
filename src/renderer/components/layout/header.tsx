import styles from './header.module.scss'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import Minus from './../../../../static/assets/icons/minus.svg'
import Minimize from './../../../../static/assets/icons/minimize.svg'
import Close from './../../../../static/assets/icons/close.svg'
import ArrowDown from './../../../../static/assets/icons/arrowDown.svg'

import userContext from '../../api/context/user.context'
import ContextMenu from '../context_menu'
import Modal from '../modal'
import config from '../../api/config'
import { marked } from 'marked'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface p {
    goBack?: boolean
}

const Header: React.FC<p> = ({ goBack }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [version, setVersion] = useState(null)
    const { user } = useContext(userContext)
    const [modal, setModal] = useState(false)
    const openModal = () => setModal(true)
    const closeModal = () => setModal(false)
    const [appInfo, setAppInfo] = useState<
        {
            id: number
            version: string
            changelog: string
            createdAt: number
        }[]
    >([])
    const modalRef = useRef<{ openModal: () => void; closeModal: () => void }>(
        null,
    )
    modalRef.current = { openModal, closeModal }
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && window.desktopEvents) {
            window.desktopEvents
                ?.invoke('getVersion')
                .then((version: string | undefined) => {
                    console.log(version)
                    setVersion(version)
                })
        }
    }, [])
    useEffect(() => {
        if (user.id !== '-1') {
            fetchAppInfo()
        }
    }, [user])

    const fetchAppInfo = async () => {
        try {
            const res = await fetch(`${config.SERVER_URL}api/v1/app/info`)
            const data = await res.json()
            if (data.ok && Array.isArray(data.appInfo)) {
                const sortedAppInfos = data.appInfo.sort(
                    (a: any, b: any) => b.id - a.id,
                )
                setAppInfo(sortedAppInfos)
            } else {
                console.error('Invalid response format:', data)
            }
        } catch (error) {
            console.error('Failed to fetch app info:', error)
        }
    }

    const memoizedAppInfo = useMemo(() => appInfo, [appInfo])

    const formatDate = (timestamp: any) => {
        const date = new Date(timestamp * 1000)
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }
    return (
        <>
            <Modal
                title="Последние обновления"
                isOpen={modal}
                reqClose={closeModal}
            >
                <div className={styles.updateModal}>
                    {memoizedAppInfo
                        .filter(info => info.version <= version)
                        .map(info => (
                            <div key={info.id}>
                                <div className={styles.version_info}>
                                    <h3>{info.version}</h3>
                                    <span>{formatDate(info.createdAt)}</span>
                                </div>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
                                    {info.changelog}
                                </ReactMarkdown>
                                <hr />
                            </div>
                        ))}
                </div>
            </Modal>
            <header className={styles.nav_bar}>
                <div className={styles.fix_size}>
                    <div className={styles.app_menu}>
                        <button
                            className={styles.logoplace}
                            onClick={toggleMenu}
                            disabled={user.id === '-1'}
                        >
                            <img
                                className={styles.logoapp}
                                src="static/assets/logo/logoapp.svg"
                                alt=""
                            />
                            <span>PulseSync</span>
                            <div
                                className={
                                    isMenuOpen ? styles.true : styles.false
                                }
                            >
                                {user.id != '-1' && <ArrowDown />}
                            </div>
                            {isMenuOpen && <ContextMenu modalRef={modalRef} />}
                        </button>
                    </div>
                    <div className={styles.event_container}>
                        <div className={styles.menu}>
                            {user.id !== '-1' && (
                                <div className={styles.badges_container}>
                                    {user.badges.length > 0 &&
                                        user.badges.map(_badge => (
                                            <div
                                                className={styles.badge}
                                                key={_badge.type}
                                            >
                                                <img
                                                    src={`static/assets/badges/${_badge.type}.svg`}
                                                    alt={_badge.type}
                                                />
                                                <span
                                                    className={styles.tooltip}
                                                >
                                                    {_badge.name}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {user.id !== '-1' && (
                                <div className={styles.user_container}>
                                    <img src={user.avatar} alt="" />
                                    {user.username}
                                </div>
                            )}
                        </div>
                        <div className={styles.button_container}>
                            <button
                                id="hide"
                                className={styles.button_title}
                                onClick={() =>
                                    window.electron.window.minimize()
                                }
                            >
                                <Minus />
                            </button>
                            <button
                                id="minimize"
                                className={styles.button_title}
                                onClick={() =>
                                    window.electron.window.maximize()
                                }
                            >
                                <Minimize />
                            </button>
                            <button
                                id="close"
                                className={styles.button_title}
                                onClick={() => window.electron.window.close()}
                            >
                                <Close />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
