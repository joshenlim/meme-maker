import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Head from 'next/head'
import React, { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.className = 'dark'
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
