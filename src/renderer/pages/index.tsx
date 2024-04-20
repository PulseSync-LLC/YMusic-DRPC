import Layout from '../components/layout'
import styles from '../../../static/styles/page/index.module.scss'

import Container from '../components/container'

import 'crypto-browserify'
import 'stream-browserify'

export default function IndexPage() {
    return (
        <Layout title="Главная">
            <div className={styles.page}>
                <Container titleName={'Основные настройки'}>
                    sfa
                </Container>
            </div>
        </Layout>
    )
}
