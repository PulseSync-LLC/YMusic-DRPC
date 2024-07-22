import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'

import styles from '../../../../static/styles/page/indexBP20.module.scss'
import theme from './trackinfo.module.scss'

import { useState, useContext, ChangeEvent } from 'react'
import userContext from '../../api/context/user.context'
import trackInitials from '../../api/interfaces/track.initials'
import Skeleton from 'react-loading-skeleton'
import playerContext from '../../api/context/player.context'
export default function TrackInfoPage() {
    const { user, settings, yaClient } = useContext(userContext)
    const { currentTrack } = useContext(playerContext)

    const [detailsValue, setDetailsValue] = useState('');
    const [buttonValue, setButtonValue] = useState('');
    const [stateValue, setStateValue] = useState('');
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [activeInputCount, setActiveInputCount] = useState(0);

    const handleFocus = () => {
        if (activeInputCount === 0) {
            setTooltipVisible(true);
        }
        setActiveInputCount(prev => prev + 1);
    };

    const handleBlur = () => {
        setActiveInputCount(prev => {
            const newCount = prev - 1;
            if (newCount === 0) {
                setTooltipVisible(false);
            }
            return newCount;
        });
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        setValue(event.target.value);
    };

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
                                            <div>App ID</div>
                                            <input
                                                type="text"
                                                placeholder={'984031241357647892'}
                                                className={theme.styledInput}
                                            />
                                        </div>
                                        <div className={theme.textInputContainer}>
                                            <div>Details</div>
                                            <input
                                                type="text"
                                                value={detailsValue}
                                                placeholder="enter text"
                                                className={theme.styledInput}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                onChange={(event) => handleInputChange(event, setDetailsValue)}
                                            />
                                        </div>
                                        <div className={theme.textInputContainer}>
                                            <div>State</div>
                                            <input
                                                type="text"
                                                value={stateValue}
                                                placeholder="enter text"
                                                className={theme.styledInput}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                onChange={(event) => handleInputChange(event, setStateValue)}
                                            />
                                        </div>
                                        <div className={theme.line}></div>
                                        <CheckboxNav
                                            checkType="enableRpcButtonListen"
                                            description="Активируйте этот параметр, чтобы ваш текущий статус отображался в Discord."
                                        >
                                            Включить кнопку (Слушать)
                                        </CheckboxNav>
                                        <div
                                            className={theme.textInputContainer}
                                        >
                                            <div>Button</div>
                                            <input
                                                type="text"
                                                value={buttonValue}
                                                placeholder="enter text"
                                                className={theme.styledInput}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                onChange={(event) => handleInputChange(event, setButtonValue)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={theme.discordRpc}>
                                    <img
                                        className={theme.userBanner}
                                        src={
                                            user.banner
                                                ? user.banner
                                                : 'static/assets/images/no_banner.png'
                                        }
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
                                                                {currentTrack
                                                                    .timecodes
                                                                    .length >
                                                                    0 && (
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
                                                                    )}
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
                                                <div
                                                    className={theme.button}
                                                    onClick={() => {
                                                        window.open(
                                                            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                                                        )
                                                    }}
                                                >
                                                    Слушать трек на Яндекс
                                                    Музыке
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isTooltipVisible && (
                                    <div className={theme.modal}>
                                        <div className={theme.modalTitle}>Параметры поля</div>
                                        <div className={theme.modalContainer}>
                                            <button className={theme.modalContextButton}>
                                                <div className={theme.contextPreview}>track live</div>
                                                <div className={theme.contextInfo}>&#123;track&#125; - название трека</div>
                                            </button>
                                            <button className={theme.modalContextButton}>
                                                <div className={theme.contextPreview}>atrist live</div>
                                                <div className={theme.contextInfo}>&#123;atrist&#125; - имя артиста</div>
                                            </button>
                                            <button className={theme.modalContextButton}>
                                                <div className={theme.contextPreview}>startTime live</div>
                                                <div className={theme.contextInfo}>&#123;startTime&#125; - начальное время</div>
                                            </button>
                                            <button className={theme.modalContextButton}>
                                                <div className={theme.contextPreview}>endTime live</div>
                                                <div className={theme.contextInfo}>&#123;endTime&#125; - конечное время</div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
