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
  resignTemplateUrls,
} from '../utils/supabaseClient'
import * as R from 'ramda'

const TEMPLATES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_TEMPLATES_BUCKET

const Home = ({ user }) => {
  const [templates, setTemplates] = useState([])
  const [stickers, setStickers] = useState([])

  const [loadingAssets, setLoadingAssets] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loadAnimations, setLoadAnimations] = useState(false)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 500
  const isAdmin = R.pathOr('', ['email'], user).includes('@supabase.io')

  useEffect(() => {
    const initAssets = async () => {
      const stickers = await getStickers()
      setStickers(stickers)

      const templates = await getTemplates()
      setTemplates(templates)

      setLoadingAssets(false)
    }
    initAssets()
    setTimeout(() => {
      setLoadAnimations(true)
    }, 2000)
  }, [])

  const onSelectChangeTemplate = () => {
    setShowTemplatesPanel(true)
  }

  const onTemplateUpload = async (event) => {
    setUploading(true)
    setSelectedTemplate(null)
    event.persist()
    const files = event.target.files
    const key = await uploadFile(files[0], user, TEMPLATES_BUCKET)
    const formattedKey = key.split('/').slice(1).join('/')
    const url = await getSignedUrl(TEMPLATES_BUCKET, formattedKey)
    setUploadedFileUrl(url)
    setUploading(false)
    setShowTemplatesPanel(false)
    event.target.value = ''
  }

  const loadTemplate = async (template) => {
    const formattedTemplate = await resignTemplateUrls(template)
    setSelectedTemplate(formattedTemplate)
    setShowTemplatesPanel(false)
  }

  return (
    <>
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="max-w-screen-xl mx-auto flex-grow flex flex-col">
          <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center text-white">
            <div className="pt-4 mb-4 sm:pt-6 sm:mb-2">
              <Typography.Title
                className="hidden sm:block font-medium bg-center bg-no-repeat bg-cover"
                level={2}
              >
                Create your{' '}
                <span
                  className="bg-center bg-no-repeat bg-cover"
                  style={{
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    backgroundImage:
                      "url('https://i.giphy.com/media/2tNvsKkc0qFdNhJmKk/giphy.webp')",
                  }}
                >
                  best memes
                </span>{' '}
                within seconds
              </Typography.Title>
              <Typography.Title
                className="sm:hidden font-medium bg-center bg-no-repeat bg-cover"
                level={3}
              >
                Create your{' '}
                <span
                  className="bg-center bg-no-repeat bg-cover"
                  style={{
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    backgroundImage:
                      "url('https://i.giphy.com/media/2tNvsKkc0qFdNhJmKk/giphy.webp')",
                  }}
                >
                  best memes
                </span>{' '}
                <br />
                within seconds
              </Typography.Title>
            </div>
            <div className="pb-4 hidden sm:block">
              <Typography>
                Here at Supabase we love memes - and so here's a meme maker ????
              </Typography>
            </div>
            {typeof window !== 'undefined' && (
              <Editor
                user={user}
                isMobile={isMobile}
                isAdmin={isAdmin}
                stickers={stickers}
                templates={templates}
                selectedTemplate={selectedTemplate}
                uploading={uploading}
                uploadedFileUrl={uploadedFileUrl}
                onTemplateUpload={onTemplateUpload}
                onSelectChangeTemplate={onSelectChangeTemplate}
              />
            )}
          </main>
        </div>
        <TemplatesPanel
          templates={templates}
          loadingAssets={loadingAssets}
          uploading={uploading}
          visible={showTemplatesPanel}
          loadTemplate={loadTemplate}
          onTemplateUpload={onTemplateUpload}
          hideTemplatesPanel={() => setShowTemplatesPanel(false)}
        />
        <div className="hidden sm:flex justify-end absolute bottom-0 right-0 group">
          <div
            className={`-translate-x-20 ${
              loadAnimations ? 'translate-y-36' : 'translate-y-64'
            } transition group-hover:translate-y-24 cursor-pointer`}
          >
            <Image
              src="/img/doge.png"
              width={150}
              height={204}
              onClick={() => setShowHelpModal(true)}
            />
          </div>
          <p
            className="text-white absolute w-64 transition opacity-0 translate-y-32 rotate-0 group-hover:translate-y-16 group-hover:opacity-100 group-hover:-rotate-12"
            style={{
              fontFamily: 'Impact',
              WebkitTextStrokeColor: '#000000',
              WebkitTextStrokeWidth: 1,
            }}
          >
            MUCH COOL, HELP NEED?
          </p>
        </div>
      </div>
      <HelpModal visible={showHelpModal} onCloseModal={() => setShowHelpModal(false)} />
    </>
  )
}

export default Home
