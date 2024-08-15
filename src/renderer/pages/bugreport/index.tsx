import Layout from '../../components/layout'
import Container from '../../components/container'

import * as styles from '../../../../static/styles/page/index.module.scss'
import * as theme from './bugreport.module.scss'

export default function BugReportPage() {
    return (
        <Layout title="Bug Report">
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.main_container}>
                        <Container
                            titleName={'Bug Report'}
                            description={'Опишите свою проблему чтоб мы могли решить проблему.'}
                            imageName={'bugReport'}
                        ></Container>
                        <div className={styles.container30x15}>
                            <div className={theme.container}>
                                <div
                                    className={theme.optionalContainer}
                                >
                                    <div
                                        className={
                                            theme.textInputContainer
                                        }
                                    >
                                        <div>Заголовок</div>
                                        <input
                                            type="text"
                                            placeholder="Заголовок"
                                            className={
                                                theme.styledInput
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            theme.textInputContainer
                                        }
                                    >
                                        <div>Описание проблемы</div>
                                        <textarea
                                            style={{ height: "130px" }}
                                            placeholder="описание"
                                            className={
                                                theme.styledInput
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            theme.textInputContainer
                                        }
                                    >
                                        <div>шаги воспроизведения проблемы</div>
                                        <textarea
                                            style={{ height: "170px" }}
                                            placeholder="описание"
                                            className={
                                                theme.styledInput
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={theme.rightPos}>
                                    <button className={theme.sendButton}>Отправить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}