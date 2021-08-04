import { Button, Dropdown, IconAlignLeft, IconAlignCenter, IconAlignRight } from '@supabase/ui'
import * as R from 'ramda'

const TextAlign = ({ selectedObject = () => {}, updateTextAttribute = () => {} }) => {
  const selectedAlignment = R.pathOr('center', ['textAlign'], selectedObject)

  // Maybe can just loop through some constant?
  return (
    <Dropdown
      overlay={[
        <div key="text-align-options" className="flex items-center p-2 space-x-2">
          <div className={`p-1 ${selectedAlignment === 'left' ? 'bg-gray-500 rounded' : ''}`}>
            <IconAlignLeft
              className="cursor-pointer text-white"
              strokeWidth={2}
              onClick={() => updateTextAttribute({ textAlign: 'left' })}
            />
          </div>
          <div className={`p-1 ${selectedAlignment === 'center' ? 'bg-gray-500 rounded' : ''}`}>
            <IconAlignCenter
              className="cursor-pointer text-white"
              strokeWidth={2}
              onClick={() => updateTextAttribute({ textAlign: 'center' })}
            />
          </div>
          <div className={`p-1 ${selectedAlignment === 'right' ? 'bg-gray-500 rounded' : ''}`}>
            <IconAlignRight
              className="cursor-pointer text-white"
              strokeWidth={2}
              onClick={() => updateTextAttribute({ textAlign: 'right' })}
            />
          </div>
        </div>,
      ]}
    >
      <div className="h-10 flex">
        <Button
          type="text"
          icon={
            selectedAlignment === 'center' ? (
              <IconAlignCenter size="medium" strokeWidth={2} />
            ) : selectedAlignment === 'left' ? (
              <IconAlignLeft size="medium" strokeWidth={2} />
            ) : (
              <IconAlignRight size="medium" strokeWidth={2} />
            )
          }
        />
      </div>
    </Dropdown>
  )
}

export default TextAlign
