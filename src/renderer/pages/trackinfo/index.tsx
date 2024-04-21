import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from '../../../../static/styles/page/index.module.scss'
// import theme from './trackinfo.module.scss'

export default function TrackInfoPage() {
    return (
        <Layout title="Информация о треке">
            <div className={styles.page}>
                <Container titleName={'Информация о треке'}>Скоро</Container>
            </div>
        </Layout>
    )
}
