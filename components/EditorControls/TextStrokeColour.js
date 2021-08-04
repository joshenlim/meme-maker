import { Button, Dropdown, Input } from '@supabase/ui'
import * as R from 'ramda'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const TextStrokeColour = ({
  swatches = [],
  selectedObject = {},
  updateTextAttribute = () => {},
}) => {
  const textColour = R.pathOr('#FFFFFF', ['stroke'], selectedObject)
  const [hexColour, setHexColour] = useState(textColour)

  useEffect(() => {
    setHexColour(textColour)
  }, [textColour])

  const formatHexColour = (value) => {
    return (value[0] !== '#' ? `#${value}` : value).toUpperCase()
  }

  const updateTextHexColour = (event) => {
    event.preventDefault()

    const formattedHexColour = formatHexColour(hexColour)
    setHexColour(formattedHexColour)

    const re = /[0-9A-Fa-f]{6}/g
    if (!re.test(hexColour)) {
      return toast.error('Please enter a valid hex value')
    }

    // Can be refactored to be nicer
    updateTextAttribute({ stroke: formattedHexColour })
  }

  return (
    <Dropdown
      overlay={[
        <Dropdown.Misc>
          <div key="stroke-swatches" className="flex items-center space-x-2">
            {R.map(
              (swatch) => (
                <div
                  key={swatch}
                  className="w-6 h-6 rounded-full border-2 border-gray-100 shadow cursor-pointer"
                  style={{ backgroundColor: swatch }}
                  onClick={() => updateTextAttribute({ stroke: swatch })}
                />
              ),
              swatches
            )}
          </div>
        </Dropdown.Misc>,
        <Dropdown.Misc>
          <form onSubmit={updateTextHexColour}>
            <Input
              placeholder="#FFFFFF"
              value={hexColour}
              onChange={(event) => setHexColour(event.target.value)}
            />
          </form>
        </Dropdown.Misc>,
      ]}
    >
      <div className="formatButton h-10 flex">
        <Button type="text" onClick={() => {}}>
          <div className="flex flex-col justify-center">
            <span
              className="text-[20px] text-gray-200"
              style={{
                WebkitTextStrokeColor: R.pathOr('#FFFFFF', ['stroke'], selectedObject),
                WebkitTextStrokeWidth: 1,
              }}
            >
              A
            </span>
          </div>
        </Button>
      </div>
    </Dropdown>
  )
}

export default TextStrokeColour
