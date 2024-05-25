import Header from '../../components/layout/header'
import Container from '../../components/container'
import { useState } from 'react'
import { useEffect } from 'react'
import MarkDown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import styles from './auth.module.scss'

import CheckboxNav from '../../components/checkbox'

import { MdWarning } from 'react-icons/md'
import Discord from './../../../../static/assets/icons/discordLogin.svg'

export default function AuthPage() {
    const [mdText, setMdText] = useState(null)
    useEffect(() => {
        // Fetch the Markdown file and set its content to the state
        fetch("../../../../static/assets/policy/terms.ru.md")
            .then((response) => response.text())
            .then((text) => setMdText(text));
    }, []);
    return (
        <>
            <Header />
            <div className={styles.main_window}>
                <Container imageName='login' titleName='Авторизация'>
                    <div className={styles.container}>
                        <div className={styles.policy}>
                            <MarkDown remarkPlugins={[remarkGfm]}>{mdText}</MarkDown>
                        </div>
                        <CheckboxNav>
                            <MdWarning size={22} />
                            Я соглашаюсь со всеми выше перечисленными условиями.
                        </CheckboxNav>
                        <button className={styles.discordAuth}>
                            <Discord />
                            Авторизация через дискорд
                        </button>
                    </div>
                </Container>
            </div>
        </>
    )
}
