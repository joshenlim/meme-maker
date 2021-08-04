import { Button, Dropdown } from '@supabase/ui'
import * as R from 'ramda'

const TextFillColour = ({
  swatches = [],
  selectedObject = {},
  updateTextAttribute = () => {},
}) => {
  return (
    <Dropdown
      overlay={[
        <Dropdown.Misc>
          <div key="fill-swatches" className="flex items-center space-x-2">
            {R.map((swatch) => (
              <div
                key={swatch}
                className="w-6 h-6 rounded-full border-2 border-gray-100 shadow cursor-pointer"
                onClick={() => updateTextAttribute({ fill: swatch })}
                style={{ backgroundColor: swatch }}
              />
            ), swatches)}
          </div>
        </Dropdown.Misc>
      ]}
    >
      <div className="formatButton h-10 flex">
        <Button type="text" onClick={() => {}}>
          <div className="flex flex-col justify-center">
            <span className="text-[17px] text-gray-200">A</span>
            <div
              className="w-full"
              style={{
                height: '2px',
                backgroundColor: R.pathOr('#000000', ['fill'], selectedObject),
                marginTop: '1px'
              }}
            />
          </div>
        </Button>
      </div>
    </Dropdown>
  )
}

export default TextFillColour