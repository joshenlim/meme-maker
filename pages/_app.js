import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import * as Portal from '@radix-ui/react-portal'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.className = 'dark'
  }, [])

  return <>
    <Component {...pageProps} />
    <Portal.Root className="portal--toast">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            'dark:bg-bg-primary-dark dark:text-typography-body-strong-dark border border-gray-500',
          style: {
            padding: '8px',
            paddingLeft: '16px',
            paddingRight: '16px',
            fontSize: '0.875rem',
          },
        }}
      />
    </Portal.Root>
  </>
}

export default MyApp
