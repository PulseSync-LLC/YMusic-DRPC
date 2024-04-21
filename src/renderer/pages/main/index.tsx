import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from '../../../../static/styles/page/index.module.scss'
import CheckboxNav from '../../components/checkbox'
import ButtonPather from '../../components/button_pather'

import { MdAdd, MdAirplay, MdBlock, MdDirectionsRun, MdReplay } from 'react-icons/md'
// import main from './main.module.scss'

export default function IndexPage() {
    return (
        <Layout title="Основные настройки">
            <div className={styles.page}>
                <Container titleName={'Основные настройки'}>
                    <div className={styles.container}>
                        <CheckboxNav>
                            <MdDirectionsRun size={22} />
                            Авто-запуск Яндекс Музыки
                        </CheckboxNav>
                        <CheckboxNav>
                            <MdAirplay size={22} />
                            Включить статус дискорд
                        </CheckboxNav>
                        <div className={styles.container_witch_text}>
                            Патчер Яндекс Музыки
                            <div className={styles.container_patcher}>
                                <ButtonPather icon={<MdAdd size={34} />} text={'Патч'} />
                                <ButtonPather icon={<MdReplay size={34} />} text={'Репатч'} />
                                <ButtonPather icon={<MdBlock size={34} />} text={'Депатч'} />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
