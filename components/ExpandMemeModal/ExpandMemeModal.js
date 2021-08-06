import { Modal } from '@supabase/ui'

const ExpandMemeModal = ({ meme, visible = false, onCloseModal = () => {} }) => {
  return (
    <Modal hideFooter closable visible={visible} onCancel={onCloseModal}>
      {meme && <img className="mx-auto" src={meme.url} />}
    </Modal>
  )
}

export default ExpandMemeModal
