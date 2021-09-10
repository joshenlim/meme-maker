import { Button, Divider, Dropdown, IconPlus, Typography } from '@supabase/ui'
import { useRef } from 'react'
import * as R from 'ramda'

const StickerSelection = ({
  stickers = [],
  onAddSticker = () => {},
  onSelectUploadSticker = () => {},
}) => {
  return (
    <Dropdown
      className="max-h-[180px] !overflow-y-auto"
      overlay={[
        <Dropdown.Item key="upload" onClick={onSelectUploadSticker}>
          <div className="flex items-center py-1 space-x-4">
            <Typography.Text small>Upload sticker</Typography.Text>
            <IconPlus strokeWidth={2} size={16} />
          </div>
        </Dropdown.Item>,
        <Divider light />,
        ...R.map(
          (sticker) => (
            <Dropdown.Item key={sticker.id} onClick={() => onAddSticker(sticker)}>
              <div className="flex items-center space-x-4">
                <img className="w-6" src={sticker.url} />
                <Typography.Text small>{sticker.name}</Typography.Text>
              </div>
            </Dropdown.Item>
          ),
          stickers
        ),
      ]}
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
