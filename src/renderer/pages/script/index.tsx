import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from '../../../../static/styles/page/index.module.scss'
// import theme from './script.module.scss'

export default function ScriptPage() {
    return (
        <Layout title="Скриптинг">
            <div className={styles.page}>
                <Container titleName={'Скриптинг'}>Скоро</Container>
            </div>
        </Layout>
    )
}
