import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import IndexPage from './main'
import TrackInfoPage from './trackinfo'
import ThemePage from './theme'
import ScriptPage from './script'
import JointPage from './joint'
import OtherPage from './other'

import { Toaster } from 'react-hot-toast'
import { CssVarsProvider } from '@mui/joy'

function app() {
    const router = createHashRouter([
        {
            path: '/',
            element: <IndexPage />,
        },
        {
            path: '/trackinfo',
            element: <TrackInfoPage />,
        },
        {
            path: '/theme',
            element: <ThemePage />,
        },
        {
            path: '/script',
            element: <ScriptPage />,
        },
        {
            path: '/joint',
            element: <JointPage />,
        },
        {
            path: '/other',
            element: <OtherPage />,
        },
    ])

    return (
        <div className="app-wrapper">
            <Toaster />
            <CssVarsProvider>
                <RouterProvider router={router} />
            </CssVarsProvider>
        </div>
    )
}

export default app
