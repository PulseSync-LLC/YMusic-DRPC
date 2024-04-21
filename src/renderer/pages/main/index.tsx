import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from '../../../../static/styles/page/index.module.scss'
import CheckboxNav from '../../components/checkbox'

import { MdAirplay, MdDirectionsRun } from 'react-icons/md'
// import main from './main.module.scss'

export default function IndexPage() {
    return (
        <Layout title="Основные настройки">
            <div className={styles.page}>
                <Container titleName={'Основные настройки'}>
                    <div className={styles.container}>
                        <CheckboxNav>
                            <MdDirectionsRun size={22}/>
                            Авто-запуск Яндекс Музыки
                        </CheckboxNav>
                        <CheckboxNav>
                            <MdAirplay size={22}/>
                            Включить статус дискорд
                        </CheckboxNav>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
