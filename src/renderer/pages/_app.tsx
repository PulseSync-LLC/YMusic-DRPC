import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import IndexPage from './index'
import { Toaster } from 'react-hot-toast'
import { CssVarsProvider } from '@mui/joy'

function app() {
    const router = createHashRouter([
        {
            path: '/',
            element: <IndexPage />,
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
