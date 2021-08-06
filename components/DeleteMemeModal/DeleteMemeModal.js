import { IconAlertCircle, Modal, Typography } from '@supabase/ui'
import { messages } from './constants'

const DeleteMemeModal = ({
  visible = false,
  onCancelDelete = () => {},
  onConfirmDelete = () => {},
}) => {
  return (
    <Modal
      className="relative"
      size="medium"
      title="Confirm to delete meme?"
      description={`${
        messages[(messages.length * Math.random()) | 0]
      } Are you sure? This action cannot be undone.`}
      icon={<IconAlertCircle background="yellow" />}
      visible={visible}
      onCancel={onCancelDelete}
      onConfirm={onConfirmDelete}
    >
      <img className="w-[100px] absolute bottom-0 right-12" src="/img/surprised-pikachu.png" />
    </Modal>
  )
}

export default DeleteMemeModal
