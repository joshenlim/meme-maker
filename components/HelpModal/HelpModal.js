import { Modal, Typography } from '@supabase/ui'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const HelpModal = ({ visible = false, onCloseModal = () => {} }) => {

  const [loadAnimations, setLoadAnimations] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLoadAnimations(true)
    }, 1000)
    if (visible) {
      setLoadAnimations(false)
    }
  }, [visible])

  return (
    <Modal
      hideFooter
      title="Welcome to the Meme Maker!"
      description="Disclaimer: This was built for Supabase's Hackathon so it'll probably not be maintained for too long (probably)"
      visible={visible}
      onCancel={onCloseModal}
    >
      <div className="mt-2 relative">
        <p><Typography.Text>We provide a very simple interface to create memes quickly. You can:</Typography.Text></p>
        <ul className="list-disc text-white pl-6 my-2">
          <li>
            <Typography.Text>Add and format textboxes to write the perfect captions</Typography.Text>
          </li>
          <li>
            <Typography.Text>Add stickers from our curated list for some pizzazz</Typography.Text>
          </li>
          <li>
            <Typography.Text>Adjust the ordering of layers across your elements</Typography.Text>
          </li>
          <li>
            <Typography.Text>Change your meme template easily if you're not feeling it</Typography.Text>
          </li>
        </ul>
        <p><Typography.Text>Once your meme is good to go, you can either save it to view on this app, or export it directly to PNG</Typography.Text></p>
        <p className="mt-4"><Typography>Have fun! 🎊</Typography></p>
        <p><Typography.Text>
          Built by <a className="text-green-600 hover:text-green-400 transition" href="https://github.com/joshenlim" target="_blank">joshenlim</a>
        </Typography.Text></p>
        <div className="absolute -translate-y-20 translate-x-36 right-0">
          <Image src="/img/girl-running.png" height={118} width={200} />
        </div>
        <p
          className={`text-white absolute right-0 translate-x-36 transition rotate-12 ${loadAnimations ? 'opacity-100 -translate-y-28' : 'opacity-0 -translate-y-20'}`}
          style={{ fontFamily: 'Impact', WebkitTextStrokeWidth: 1, WebkitTextStrokeColor: '#000000' }}
        >
          LET'S GO
        </p>
      </div>
    </Modal>
  )
}

export default HelpModal