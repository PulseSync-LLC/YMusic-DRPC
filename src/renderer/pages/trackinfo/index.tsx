import Layout from '../../components/layout'
import Container from '../../components/container'

import CheckboxNav from '../../components/checkbox'
import ButtonDefault from '../../components/button_default'

import styles from '../../../../static/styles/page/index.module.scss'
import theme from './trackinfo.module.scss'

import { MdDownload, MdVideoLibrary } from 'react-icons/md'

export default function TrackInfoPage() {
    return (
        <Layout title="Информация о треке">
            <div className={styles.page}>
                <Container titleName={'Информация о треке'}>
                    <div className={styles.container}>
                        <div className={theme.container}>
                            <div className={theme.flex_container}>
                                <img className={theme.img} src="../../../../static/assets/logo/logoapp.png" alt="" />
                                <div className={theme.gap}>
                                    <div className={theme.yndex}>Yandex Music</div>
                                    <div className={theme.name}>Angelic Sphere - 3R2</div>
                                    <div className={theme.time}>00:06 - 02:12</div>
                                </div>
                            </div>
                            <div className={theme.button}>Слушать</div>
                        </div>
                        <CheckboxNav>
                            <MdVideoLibrary size={22} />
                            Включить кнопку (Слушать)
                        </CheckboxNav>
                        <ButtonDefault>
                            <MdDownload size={24} />
                            Скачать {"track name"} - {"track author"} в папку музыка
                        </ButtonDefault>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}
