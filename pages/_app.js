import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Badge, Button, Typography } from '@supabase/ui'
import * as Portal from '@radix-ui/react-portal'
import * as R from 'ramda';

import Header from '../components/Header/Header'
import LogInModal from '../components/LogInModal/LogInModal'
import { getSession, getUser, signOut } from '../utils/supabaseClient'

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    document.body.className = 'dark'
    
    const session = getSession()
    if (session) {
      const sessionExpired = session.expires_at <= Math.floor(Date.now() / 1000)
      if (sessionExpired) {
        toast('Your session is expired, please log in again')
        return localStorage.removeItem('supabase.auth.token')
      }
      const sessionUser = getUser()
      if (sessionUser) setUser(sessionUser)
    }
  }, [])

  const [user, setUser] = useState(null)
  const [showLogInModal, setShowLogInModal] = useState(false)

  const isAdmin = R.pathOr('', ['email'], user).includes('@supabase.io')

  const onSelectLogIn = () => {
    setShowLogInModal(true)
  }

  const onLoginSuccess = (sessionUser) => {
    toast.success(`Successfully logged in! 😄`)
    setUser(sessionUser)
    setShowLogInModal(false)
  }

  const onSelectLogOut = async () => {
    await signOut()
    toast.success('Successfully logged out 👋🏻')
    setUser(null)
  }

  return (
    <div className="bg-gray-800">
      <Head>
        <title>Meme Maker | Supabase</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
      </Head>
      <Header
        user={user}
        isAdmin={isAdmin}
        onSelectLogOut={onSelectLogOut}
        onSelectLogIn={onSelectLogIn}
      />
      <Component {...pageProps} user={user} />
      <LogInModal
        visible={showLogInModal}
        onLoginSuccess={onLoginSuccess}
        onCloseModal={() => setShowLogInModal(false)}
      />
      <Portal.Root className="portal--toast">
        <Toaster
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
    </div>
  )
}

export default MyApp
