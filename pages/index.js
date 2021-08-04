import { useEffect, useState } from 'react'
import { Button, Typography } from '@supabase/ui'

import Editor from '../components/Editor/Editor'
import TemplatesPanel from '../components/TemplatesPanel/TemplatesPanel'
import {
  uploadFile,
  getSignedUrl,
  getStickers,
  getTemplates,
} from '../utils/supabaseClient'
import * as R from 'ramda'

const TEMPLATES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_TEMPLATES_BUCKET

const Home = ({ user }) => {
  const [templates, setTemplates] = useState([])
  const [stickers, setStickers] = useState([])

  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)

  const isAdmin = R.pathOr('', ['email'], user).includes('@supabase.io')

  useEffect(() => {
    const initAssets = async () => {
      const stickers = await getStickers()
      setStickers(stickers)

      const templates = await getTemplates()
      setTemplates(templates)
    }
    initAssets()
  }, [])

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
    <div className="relative h-screen">
      <div className={`absolute top-20 right-0 transition transform ${user ? 'translate-x-1' : 'translate-x-36'}`}>
        <Button size="medium">
          <Typography.Text small>View your memes</Typography.Text>
        </Button>
      </div>

      <div className="max-w-screen-xl mx-auto flex-grow flex flex-col">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-white">
          <div className="flex flex-col py-8 space-y-2">
            <Typography.Title level={2}>Ye Ol' Meme Maker</Typography.Title>
            <Typography>Here at Supabase we love memes - and so here's a meme maker 💚</Typography>
          </div>
          <Editor
            user={user}
            isAdmin={isAdmin}
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

export default Home