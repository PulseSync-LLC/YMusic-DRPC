import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from '../../../../static/styles/page/index.module.scss'
// import theme from './other.module.scss'

export default function OtherPage() {
    return (
        <Layout title="Остальное">
            <div className={styles.page}>
                <Container titleName={'Остальное'}>Скоро</Container>
            </div>
        </Layout>
    )
}
