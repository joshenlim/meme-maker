import { IconPlus, IconMinus, Input } from '@supabase/ui'
import * as R from 'ramda'

const FontSize = ({ selectedObject = {}, updateTextAttribute = () => {} }) => {
  return (
    <div className="flex items-center">
      <div
        className="rounded-l-md border border-gray-500 border-r-0 p-2 h-full cursor-pointer transition hover:bg-gray-500"
        onClick={() => updateTextAttribute({ fontSize: Number(selectedObject.fontSize) - 1 })}
      >
        <IconMinus size="medium" strokeWidth={2} />
      </div>
      <Input
        type="number"
        className="fontSizeInput"
        value={R.pathOr(0, ['fontSize'], selectedObject)}
        onChange={(event) => updateTextAttribute({ fontSize: event.target.value || 1 })}
      />
      <div
        className="rounded-r-md border border-gray-500 border-l-0 p-2 h-full cursor-pointer transition hover:bg-gray-500"
        onClick={() => updateTextAttribute({ fontSize: Number(selectedObject.fontSize) + 1 })}
      >
        <IconPlus size="medium" strokeWidth={2} />
      </div>
    </div>
  )
}

export default FontSize
