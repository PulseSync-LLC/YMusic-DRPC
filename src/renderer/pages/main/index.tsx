import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from '../../../../static/styles/page/index.module.scss'
import CheckboxNav from '../../components/checkbox'
import ButtonPather from '../../components/button_pather'

import { MdAdd, MdBlock, MdDirectionsRun, MdReplay } from 'react-icons/md'
import { useContext, useState } from 'react'
import userContext from '../../api/context/user.context'
// import main from './main.module.scss'

export default function IndexPage() {
    const { user, setUser } = useContext(userContext)
    const patch = () => {
        window.electron.patcher.patch()
        setUser((prevUser: any) => ({
            ...prevUser,
            patched: true,
        }))
    }
    const repatch = () => {
        window.electron.patcher.repatch()
    }
    const depatch = () => {
        window.electron.patcher.depatch()
        setUser((prevUser: any) => ({
            ...prevUser,
            patched: false,
        }))
    }
    return (
        <Layout title="Основные настройки">
            <div className={styles.page}>
                <Container titleName={'Основные настройки'}>
                    <div className={styles.container}>
                        <CheckboxNav checkType="autoStartMusic">
                            <MdDirectionsRun size={22} />
                            Авто-запуск Яндекс Музыки
                        </CheckboxNav>
                        <div className={styles.container_witch_text}>
                            Патчер Яндекс Музыки
                            <div className={styles.container_patcher}>
                                <ButtonPather
                                    icon={<MdAdd size={34} />}
                                    onClick={() => patch()}
                                    disabled={user.patched}
                                    text={'Патч'}
                                />
                                <ButtonPather
                                    icon={<MdReplay size={34} />}
                                    onClick={() => repatch()}
                                    disabled={!user.patched}
                                    text={'Репатч'}
                                />
                                <ButtonPather
                                    icon={<MdBlock size={34} />}
                                    onClick={() => depatch()}
                                    disabled={!user.patched}
                                    text={'Депатч'}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
