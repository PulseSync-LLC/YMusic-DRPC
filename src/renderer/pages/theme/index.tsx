import Layout from '../../components/layout'
import Container from '../../components/container'

import styles from './theme.module.scss'

export default function ThemePage() {
    return (
        <Layout title="Стилизация">
            <div className={styles.page}>
                <Container titleName={'Стилизация'}>sffsfs</Container>
            </div>
        </Layout>
    )
}
