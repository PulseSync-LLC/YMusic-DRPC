import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'
import ButtonDefault from '../../components/button_default'

import styles from '../../../../static/styles/page/index.module.scss'
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
export default function TrackInfoPage() {
    const { user, setUser, socket, loading } = useContext(userContext)
    const { currentTrack } = useContext(playerContext)

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
                            {user.socket_connected ? (
                                <div className={theme.flex_container}>
                                    <img
                                        className={theme.img}
                                        src={
                                            currentTrack.requestImgTrack[1]
                                                ? currentTrack
                                                      .requestImgTrack[1]
                                                : '../../../../static/assets/logo/logoapp.png'
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
                                    <Skeleton width={500} height={30} />
                                    <Skeleton
                                        width={400}
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
                        <ButtonDefault disabled>
                            <MdDownload size={22} />
                            Скачать {'track name'} - {'track author'} в папку
                            музыка
                        </ButtonDefault>
                        <ButtonDefault disabled>
                            <MdFolderOpen size={22} />
                            Дериктория со скаченой музыкой
                        </ButtonDefault>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
