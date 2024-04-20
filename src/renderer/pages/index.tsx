import Layout from '../components/layout'
import styles from '../../../static/styles/page/index.module.scss'
import 'crypto-browserify'
import 'stream-browserify'

export default function IndexPage() {
    return (
        <Layout title="Главная">
            <div className={styles.page}>
                Бэкенд — это серверная часть веб-приложения, скрытая от глаз
                пользователя. Это понятие включает в себя серверы, на которых
                расположены веб-страницы и определенную логику, которая
                управляет функциями и процессами сайта. Здесь можно почитать
                более подробное описание внутренней работы веб-приложений.
            </div>
        </Layout>
    )
}
