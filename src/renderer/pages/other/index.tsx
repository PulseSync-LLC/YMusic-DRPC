import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'
import ButtonDefault from '../../components/button_default'

import styles from '../../../../static/styles/page/index.module.scss'
import {
    MdCloseFullscreen,
    MdDirectionsRun,
    MdFolderOpen,
    MdOutlineLogout,
} from 'react-icons/md'
import config from '../../api/config'
import getUserToken from '../../api/getUserToken'
import toast from 'react-hot-toast'
import userContext from '../../api/context/user.context'
import { useContext } from 'react'
import userInitials from '../../api/interfaces/user.initials'
// import theme from './other.module.scss'

export default function OtherPage() {
    const { user, setUser } = useContext(userContext)
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
    return (
        <Layout title="Основные настройки">
            <div className={styles.page}>
                <Container
                    titleName={'Основные настройки'}
                    imageName={'settings'}
                >
                    <div className={styles.container}>
                        <ButtonDefault
                            onClick={() => {
                                window.desktopEvents.send('openAppPath')
                            }}
                        >
                            <MdFolderOpen size={22} />
                            Директория приложения
                        </ButtonDefault>
                        <CheckboxNav checkType="autoStartMusic">
                            <MdDirectionsRun size={22} />
                            Авто-запуск Яндекс Музыки
                        </CheckboxNav>
                        <CheckboxNav checkType="autoStartInTray">
                            <MdCloseFullscreen size={22} />
                            Запускать автоматически в трей
                        </CheckboxNav>
                        <ButtonDefault onClick={logout}>
                            <MdOutlineLogout size={22} />
                            Выйти
                        </ButtonDefault>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
