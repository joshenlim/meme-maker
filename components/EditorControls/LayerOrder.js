import { Button, Dropdown, IconLayers, IconChevronUp, IconChevronDown } from '@supabase/ui'
import * as R from 'ramda'

const LayerOrder = ({
  shiftObjectForward = () => {},
  shiftObjectBackward = () => {}
}) => {
  return (
    <Dropdown
      overlay={[
        <div key="text-align-options" className="flex items-center p-2 space-x-2">
          <div className="p-1 rounded-md hover:bg-gray-600">
            <IconChevronUp
              className="cursor-pointer text-white"
              strokeWidth={2}
              onClick={shiftObjectForward}
            />
          </div>
          <div className="p-1 rounded-md hover:bg-gray-600">
            <IconChevronDown
              className="cursor-pointer text-white"
              strokeWidth={2}
              onClick={shiftObjectBackward}
            />
          </div>
        </div>,
      ]}
    >
      <div className="h-10 flex">
        <Button
          type="text"
          icon={<IconLayers size="medium" strokeWidth={2} />}
        />
      </div>
    </Dropdown>
  )
}

export default LayerOrder
