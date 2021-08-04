import { Button, Dropdown } from '@supabase/ui'
import * as R from 'ramda'

const TextStrokeColour = ({
  swatches = [],
  selectedObject = {},
  updateTextAttribute = () => {}
}) => {
  return (
    <Dropdown
      overlay={[
        <Dropdown.Misc>
          <div key="stroke-swatches" className="flex items-center space-x-2">
            {R.map((swatch) => (
              <div
                key={swatch}
                className="w-6 h-6 rounded-full border-2 border-gray-100 shadow cursor-pointer"
                style={{ backgroundColor: swatch }}
                onClick={() => updateTextAttribute({ stroke: swatch })}
              />
            ), swatches)}
          </div>
        </Dropdown.Misc>
      ]}
    >
      <div className="formatButton h-10 flex">
        <Button type="text" onClick={() => {}}>
          <div className="flex flex-col justify-center">
            <span
              className="text-[20px] text-gray-200"
              style={{
                WebkitTextStrokeColor: R.pathOr('#FFFFFF', ['stroke'], selectedObject),
                WebkitTextStrokeWidth: 1
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