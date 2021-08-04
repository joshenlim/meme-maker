import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Button, Typography } from '@supabase/ui'

import Editor from '../components/Editor/Editor'
import LogInModal from '../components/LogInModal/LogInModal'
import TemplatesPanel from '../components/TemplatesPanel/TemplatesPanel'
import { getSession, getUser, uploadFile, getSignedUrl, getStickers, getTemplates, signOut } from '../utils/supabaseClient'
import toast from 'react-hot-toast'

const TEMPLATES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_TEMPLATES_BUCKET

export default function Home() {
  const [user, setUser] = useState(null)
  const [templates, setTemplates] = useState([])
  const [stickers, setStickers] = useState([])

  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)
  const [showLogInModal, setShowLogInModal] = useState(false)

  useEffect(() => {
    const initAssets = async () => {
      const stickers = await getStickers()
      setStickers(stickers)

      const templates = await getTemplates()
      setTemplates(templates)
    }
    initAssets()

    const session = getSession()
    if (session) {
      const sessionExpired = session.expires_at <= Math.floor(Date.now()/1000)
      if (sessionExpired) {
        toast('Your session is expired, please log in again')
        return localStorage.removeItem('supabase.auth.token')
      }
      const sessionUser = getUser()
      if (sessionUser) setUser(sessionUser)
    }
  }, [])

  const onSelectLogIn = () => {
    setShowLogInModal(true)
  }

  const onSelectLogOut = async () => {
    await signOut()
    toast.success('Successfully logged out 👋🏻')
    setUser(null)
  }

  const onLoginSuccess = (sessionUser) => {
    setUser(sessionUser)
    setShowLogInModal(false)
  }

  const onSelectChangeTemplate = () => {
    setShowTemplatesPanel(true)
  }

  const onFilesUpload = async (event) => {
    setUploading(true)
    event.persist()
    const files = event.target.files
    const key = await uploadFile(files[0])
    const formattedKey = key.split('/').slice(1).join('/')
    const url = await getSignedUrl(TEMPLATES_BUCKET, formattedKey)
    setUploadedFileUrl(url)
    setUploading(false)
    setShowTemplatesPanel(false)
    event.target.value = ''
  }

  const loadTemplate = (template) => {
    setSelectedTemplate(template)
    setShowTemplatesPanel(false)
  }

  return (
    <div className="h-screen bg-gray-800">
      <Head>
        <title>Meme Maker | Supabase</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
      </Head>

      {/* Header */}
      <div className="w-full py-4 border-b border-gray-600">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto">
          <img className="h-5 w-auto" src="/img/supabase-dark.svg" alt="" />
          {user ? (
            <Button type="secondary" onClick={onSelectLogOut}>
              Log out
            </Button>
          ) : (
            <Button type="primary" onClick={onSelectLogIn}>
              Log in
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto flex-grow flex flex-col">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-white">
          <div className="flex flex-col py-8 space-y-2">
            <Typography.Title level={2}>Ye Ol' Meme Maker</Typography.Title>
            <Typography>Here at Supabase we love memes - and so here's a meme maker 💚</Typography>
          </div>
          <Editor
            stickers={stickers}
            templates={templates}
            selectedTemplate={selectedTemplate}
            uploading={uploading}
            uploadedFileUrl={uploadedFileUrl}
            onFilesUpload={onFilesUpload}
            onSelectChangeTemplate={onSelectChangeTemplate}
          />
        </main>
      </div>

      <LogInModal
        visible={showLogInModal}
        onLoginSuccess={onLoginSuccess}
        onCloseModal={() => setShowLogInModal(false)}
      />

      <TemplatesPanel
        templates={templates}
        uploading={uploading}
        visible={showTemplatesPanel}
        loadTemplate={loadTemplate}
        onFilesUpload={onFilesUpload}
        hideTemplatesPanel={() => setShowTemplatesPanel(false)}
      />
    </div>
  )
}
