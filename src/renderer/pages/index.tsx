import Layout from '../components/layout'
import Container from '../components/container'

import styles from '../../../static/styles/page/index.module.scss'

import 'crypto-browserify'
import 'stream-browserify'

export default function IndexPage() {
    return (
        <Layout title="Основные настройки">
            <div className={styles.page}>
                <Container titleName={'Основные настройки'}>sfa</Container>
            </div>
        </Layout>
    )
}
