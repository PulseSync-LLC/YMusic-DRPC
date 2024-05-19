import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'
import ButtonDefault from '../../components/button_default'

import styles from '../../../../static/styles/page/index.module.scss'
import { MdCloseFullscreen, MdDirectionsRun, MdFolderOpen } from 'react-icons/md'
// import theme from './other.module.scss'

export default function OtherPage() {
    return (
        <Layout title="Основные настройки">
            <div className={styles.page}>
                <Container titleName={'Основные настройки'} imageName={'settings'}>
                    <div className={styles.container}>
                        <ButtonDefault>
                            <MdFolderOpen size={22} />
                            Дериктория приложения
                        </ButtonDefault>
                        <CheckboxNav>
                            <MdDirectionsRun size={22} />
                            Авто-запуск Яндекс Музыки
                        </CheckboxNav>
                        <CheckboxNav>
                            <MdCloseFullscreen size={22} />
                            Запускать автоматически в трей
                        </CheckboxNav>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
