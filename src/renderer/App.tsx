import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'

import AppPage from './pages/_app'
import * as Sentry from '@sentry/electron/renderer'

function App() {
    Modal.setAppElement('#root')
    // Sentry.init({
    //     dsn: "https://6aaeb7f8130ebacaad9f8535d0c77aa8@o4507369806954496.ingest.de.sentry.io/4507369809182800",
    //     attachStacktrace: true,
    //     integrations: [
    //         Sentry.replayIntegration(),
    //     ],
    //     // Session Replay
    //     replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    //     replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    // });
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <AppPage />
        </React.StrictMode>,
    )
}

App()
