import { Button, IconTrash2 } from '@supabase/ui'
import * as R from 'ramda'

const LayerOrder = ({ onRemoveObject = () => {} }) => {
  return (
    <div className="h-10 flex">
      <Button
        type="text"
        icon={<IconTrash2 size="medium" strokeWidth={2} onClick={onRemoveObject} />}
      />
    </div>
  )
}

export default LayerOrder
