import { Button, Dropdown, Typography } from '@supabase/ui'
import * as R from 'ramda'

const StickerSelection = ({
  stickers = [],
  onAddSticker = () => {},
}) => {
  return (
    <Dropdown
      overlay={R.map((sticker) => (
        <Dropdown.Item key={sticker.id} onClick={() => onAddSticker(sticker)}>
          <div className="flex items-center">
            <Typography.Text>{sticker.name}</Typography.Text>
          </div>
        </Dropdown.Item>
      ), stickers)}
    >
      <div className="h-10 flex">
        <Button type="text">
          <img className="h-5" src="/img/sticker.svg" />
        </Button>
      </div>
    </Dropdown>
  )
}

export default StickerSelection