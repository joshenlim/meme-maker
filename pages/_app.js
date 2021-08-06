import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Toaster, toast } from 'react-hot-toast'
import * as Portal from '@radix-ui/react-portal'
import { IdProvider } from '@radix-ui/react-id'
import * as R from 'ramda'

import Header from '../components/Header/Header'
import LogInModal from '../components/LogInModal/LogInModal'
import ExpandMemeModal from '../components/ExpandMemeModal/ExpandMemeModal'
import { getSession, getUser, signOut } from '../utils/supabaseClient'
import { IconGitHub, Typography } from '@supabase/ui'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    document.body.className = 'dark'

    if (router.asPath.includes('access_token')) {
      setTimeout(() => {
        const sessionUser = getUser()
        if (sessionUser) setUser(sessionUser)
      }, 200)
      return toast.success('Successfully confirmed email - welcome!', { icon: '😎' })
    }

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
  const [expandedMeme, setExpandedMeme] = useState(null)
  const [showLogInModal, setShowLogInModal] = useState(false)

  const isAdmin = R.pathOr('', ['email'], user) === 'joshen@supabase.io'

  const onSelectLogIn = () => {
    setShowLogInModal(true)
  }

  const onLoginSuccess = (sessionUser, session) => {
    if (!session) {
      toast('Check your email to confirm your account!', { icon: '✉️' })
    } else {
      toast.success(`Successfully logged in! 😄`)
      setUser(sessionUser)
    }
    setShowLogInModal(false)
  }

  const onSelectLogOut = async () => {
    await signOut()
    toast.success('Successfully logged out 👋🏻')
    setUser(null)
  }

  const onExpandMeme = (meme) => {
    setExpandedMeme(meme)
  }

  return (
    <IdProvider>
      <div className="bg-gray-800 relative">
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
        <Component {...pageProps} user={user} onExpandMeme={onExpandMeme} />
        <LogInModal
          visible={showLogInModal}
          onLoginSuccess={onLoginSuccess}
          onCloseModal={() => setShowLogInModal(false)}
        />
        <ExpandMemeModal
          visible={!R.isNil(expandedMeme)}
          meme={expandedMeme}
          onCloseModal={() => setExpandedMeme(null)}
        />
        <footer className="flex items-center space-x-4 absolute bottom-0 p-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600">
            <a href="https://github.com/joshenlim/meme-maker" target="_blank">
              <Typography>
                <IconGitHub className="w-4 h-4" strokeWidth={2} />
              </Typography>
            </a>
          </div>
          <Typography.Text>
            Powered by{' '}
            <a
              className="text-green-600 hover:text-green-400 transition"
              href="https://supabase.io"
              target="_blank"
            >
              Supabase
            </a>
          </Typography.Text>
        </footer>
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
    </IdProvider>
  )
}

export default MyApp
