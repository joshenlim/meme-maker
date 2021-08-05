import { useEffect, useState } from 'react'
import { Typography } from '@supabase/ui'
import Image from 'next/image'

import Editor from '../components/Editor/Editor'
import HelpModal from '../components/HelpModal/HelpModal'
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
  const [loadAnimations, setLoadAnimations] = useState(false)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const isAdmin = R.pathOr('', ['email'], user).includes('@supabase.io')

  useEffect(() => {
    const initAssets = async () => {
      const stickers = await getStickers()
      setStickers(stickers)

      const templates = await getTemplates()
      setTemplates(templates)
    }
    initAssets()
    setTimeout(() => {
      setLoadAnimations(true)
    }, 2000)
  }, [])

  const onSelectChangeTemplate = () => {
    setShowTemplatesPanel(true)
  }

  const onFilesUpload = async (event) => {
    setUploading(true)
    setSelectedTemplate(null)
    event.persist()
    const files = event.target.files
    const key = await uploadFile(files[0], user)
    const formattedKey = key.split('/').slice(1).join('/')
    const url = await getSignedUrl(TEMPLATES_BUCKET, formattedKey)
    setUploadedFileUrl(url)
    setUploading(false)
    setShowTemplatesPanel(false)
    event.target.value = ''
  }

  const loadTemplate = (template) => {
    // Need to re-sign all images in the template
    setSelectedTemplate(template)
    setShowTemplatesPanel(false)
  }

  return (
    <>
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 64px)'}}>
        <div className="max-w-screen-xl mx-auto flex-grow flex flex-col">
          <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center text-white">
            <div className="flex flex-col pt-8 pb-6 space-y-2">
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
        <div className="flex justify-end absolute bottom-0 right-0 group">
          <div className={`-translate-x-20 ${loadAnimations ? 'translate-y-36' : 'translate-y-64'} transition group-hover:translate-y-24 cursor-pointer`}>
            <Image src="/img/doge.png" width={150} height={204} onClick={() => setShowHelpModal(true)} />
          </div>
          <p
            className="text-white absolute w-64 transition opacity-0 translate-y-32 rotate-0 group-hover:translate-y-16 group-hover:opacity-100 group-hover:-rotate-12"
            style={{ fontFamily: 'Impact', WebkitTextStrokeColor: '#000000', WebkitTextStrokeWidth: 1 }}
          >
            MUCH COOL, HELP NEED?
          </p>
        </div>
      </div>
      <HelpModal
        visible={showHelpModal}
        onCloseModal={() => setShowHelpModal(false)}
      />
    </>
  )
}

export default Home