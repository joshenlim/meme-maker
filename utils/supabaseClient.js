import { v4 } from 'uuid'
import * as R from 'ramda'
import { createClient } from '@supabase/supabase-js'

const MEMES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEMES_BUCKET
const STICKERS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STICKERS_BUCKET
const TEMPLATES_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_TEMPLATES_BUCKET
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const DEFAULT_LIMIT = 1000
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
    .limit(DEFAULT_LIMIT)
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

export const saveUserTemplate = async (user, file, json, template) => {
  const prefix = `${user.id}/${file.name}`
  const fileOptions = { cacheControl: 3600 }
  const { data: saveImageData, error: saveImageError } = await supabase.storage
    .from(MEMES_BUCKET)
    .upload(prefix, file, fileOptions)
  
  const path = saveImageData.Key.split('/').slice(1).join('/')
  const { data: saveRowData, error: saveDataError } = await supabase
    .from('memes')
    .insert([{
      json,
      path,
      user_id: user.id,
      template_id: R.pathOr(null, ['id'], template)
    }])

  return saveRowData
}

export const getUserMemes = async (user) => {
  const { data } = await supabase
    .from('memes')
    .select()
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .limit(DEFAULT_LIMIT)
  const res = await Promise.all(
    data.map(async (meme) => {
      const signedUrl = await getSignedUrl(MEMES_BUCKET, meme.path)
      return { ...meme, url: signedUrl }
    })
  )
  return res
}

export const getCommunityMemes = async () => {
  const { data } = await supabase
    .from('memes')
    .select()
    .is('is_public', true)
    .is('deleted_at', null)
    .limit(DEFAULT_LIMIT)
  const res = await Promise.all(
    data.map(async (meme) => {
      const signedUrl = await getSignedUrl(MEMES_BUCKET, meme.path)
      return { ...meme, url: signedUrl }
    })
  )
  return res
}

export const deleteMeme = async (meme) => {
  const { data } = await supabase
    .from('memes')
    .update({ deleted_at: new Date().toISOString() })
    .match({ id: meme.id })
  return data
}

export const resignTemplateUrls = async (template) => {
  // At the moment since we don't allow editing of user memes
  // assumption is that we only resign template image urls
  const templateObjects = await Promise.all(
    template.json.objects.map(async(object) => {
      if (R.hasPath(['src'], object)) {
        const key = object.src
          .split('/sign/')[1]
          .split('?token')[0]
        const bucket = key.split('/')[0]
        const prefix = key.split('/').slice(1).join('/')
        const signedUrl = await getSignedUrl(bucket, prefix)
        return { ...object, src: signedUrl }
      }
      return object
    })
  )
  return { 
    ...template,
    json: {
      ...template.json,
      objects: templateObjects 
    }
  }
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