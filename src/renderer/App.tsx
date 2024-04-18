import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'

import AppPage from './pages/_app'

function App() {
    Modal.setAppElement('#root')

    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <AppPage />
        </React.StrictMode>,
    )
}

App()
