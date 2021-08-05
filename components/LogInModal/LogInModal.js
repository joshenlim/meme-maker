import { Badge, Button, IconKey, IconLock, IconMail, Input, Modal, Typography } from '@supabase/ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { signUp, signIn } from '../../utils/supabaseClient'

const LogInModal = ({ visible = false, onCloseModal = () => {}, onLoginSuccess = () => {} }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [view, setView] = useState('SIGN_IN')
  const [loading, setLoading] = useState(false)

  const [loadAnimations, setLoadAnimations] = useState(false)

  useEffect(() => {
    if (visible) {
      setEmail('')
      setPassword('')
      setView('SIGN_IN')

      setLoadAnimations(false)
      setTimeout(() => setLoadAnimations(true), 750)
    }
  }, [visible])

  const toggleView = () => {
    if (view === 'SIGN_IN') {
      return setView('SIGN_UP')
    }
    return setView('SIGN_IN')
  }

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const onSignIn = async (event) => {
    event.preventDefault()

    if (!email) {
      return toast.error('Please enter an email address')
    }

    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email')
    }

    if (!password) {
      return toast.error('Please enter a password')
    }

    setLoading(true)
    const { user, session, error } =
      view === 'SIGN_IN' ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      onLoginSuccess(user, session)
    }
  }

  return (
    <Modal
      className=""
      hideFooter
      size="large"
      visible={visible}
      onCancel={onCloseModal}
      onConfirmLogin={() => {}}
    >
      <div className="flex w-full pb-4">
        <div className="flex-1 relative space-y-4">
          <Typography.Title level={3}>Makes memes great again!</Typography.Title>
          <div className="space-y-2">
            <p>
              <Typography.Text>Signing in gives you access to features:</Typography.Text>
            </p>
            <ul className="list-disc text-white pl-6">
              <li>
                <Typography.Text>
                  <span className="mr-3">💾</span>Claim, save, and publish your memes
                </Typography.Text>
              </li>
              <li className="space-x-2">
                <Typography.Text>
                  <span className="mr-3">💕</span>Be part of our meme community
                </Typography.Text>
                <Badge color="yellow">TBD</Badge>
              </li>
              <li className="space-x-2">
                <Typography.Text>
                  <span className="mr-3">🏆</span>Fight for the "Meme of the month" title!
                </Typography.Text>
                <Badge color="yellow">TBD</Badge>
              </li>
            </ul>
          </div>
          <div
            className={`absolute left-2 transition-all delay-300 ${
              loadAnimations ? 'opacity-100 -bottom-2' : 'opacity-0 -bottom-4'
            }`}
            style={{ transform: 'scaleX(-1)' }}
          >
            <img className={`rounded-md h-20 animate-bounce`} src="/img/knuckles.png" />
          </div>
          <img
            className={`absolute rounded-md h-28 transition-all -left-10 ${
              loadAnimations ? 'opacity-100 -bottom-12' : 'opacity-0 -bottom-14'
            }`}
            src="/img/me-and-the-boys.png"
          />
          <img
            className={`absolute rounded-t-md h-32 transition-all delay-200 left-52 ${
              loadAnimations ? 'opacity-100 -bottom-10' : 'opacity-0 -bottom-12'
            }`}
            src="/img/popcat.gif"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
        <div className="flex-1 space-y-4">
          <form onSubmit={onSignIn} className="space-y-8">
            <div className="flex flex-col space-y-4">
              <Input
                label="Email address"
                icon={<IconMail className="text-gray-400" />}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                label="Password"
                icon={<IconKey className="text-gray-400" />}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button block size="medium" icon={<IconLock />} loading={loading}>
              {view === 'SIGN_IN' ? 'Sign in' : 'Sign up'}
            </Button>
          </form>
          <div className="text-center cursor-pointer" onClick={toggleView}>
            <Typography.Text className="transition !text-green-700 hover:!text-green-500">
              {view === 'SIGN_IN' ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
            </Typography.Text>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default LogInModal
