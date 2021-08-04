import { v4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'

const MEMES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEMES_BUCKET
const STICKERS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STICKERS_BUCKET
const TEMPLATES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_TEMPLATES_BUCKET
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const DEFAULT_EXPIRY = 10 * 365 * 24 * 60 * 60

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const uploadFile = async (file, user) => {
  const prefix = user
    ? `users/${user.id}/${v4()}`
    : `users/${v4()}`
  const fileOptions = { cacheControl: 3600 }
  const { data } = await supabase.storage
    .from(TEMPLATES_BUCKET)
    .upload(prefix, file, fileOptions)
  return data.Key
}

export const getSignedUrl = async (bucket, prefix) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(prefix, DEFAULT_EXPIRY)
  if (error) {
    console.warn('Error', error)
    return ''
  }
  return data.signedURL
}

export const getStickers = async () => {
  const { data } = await supabase
    .from('stickers')
    .select()
  const res = await Promise.all(
    data.map(async (sticker) => {
      const signedUrl = await getSignedUrl(STICKERS_BUCKET, sticker.path)
      return { ...sticker, url: signedUrl }
    })
  )
  return res
}

export const getTemplates = async() => {
  const { data } = await supabase
    .from('templates')
    .select()
  const res = await Promise.all(
    data.map(async (template) => {
      const signedUrl = await getSignedUrl(TEMPLATES_BUCKET, template.path)
      return { ...template, url: signedUrl }
    })
  )
  return res
}

export const saveDefaultTemplate = async (name, json) => {
  const { data, error } = await supabase
    .from('templates')
    .insert([{ name, json }])
  console.log('saveTemplate', data, error)
}

export const saveUserTemplate = async (user, file, json) => {
  const prefix = `${user.id}/${file.name}`
  const fileOptions = { cacheControl: 3600 }
  const { data: saveImageData, error: saveImageError } = await supabase.storage
    .from(MEMES_BUCKET)
    .upload(prefix, file, fileOptions)
  
  const path = saveImageData.Key.split('/').slice(1).join('/')
  const { data: saveRowData, error: saveDataError } = await supabase
    .from('memes')
    .insert([{ user_id: user.id, json, path }])

  return saveRowData
}

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password })
}

export const signIn = async (email, password) => {
  return await supabase.auth.signIn({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getSession = () => {
  return supabase.auth.session()
}

export const getUser = () => {
  return supabase.auth.user()
}