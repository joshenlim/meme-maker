import { Select } from '@supabase/ui'
import * as R from 'ramda'

const FontFamily = ({
  fonts = [],
  selectedObject = {},
  updateTextAttribute = () => {},
}) => {
  return (
    <Select
      value={R.pathOr('Unknown', ['fontFamily'], selectedObject)}
      onChange={(event) => updateTextAttribute({ fontFamily: event.target.value })}
    >
      {R.map((font) => (
        <Select.Option key={font} value={font}>{font}</Select.Option>
      ), fonts)}
    </Select>
  )
}

export default FontFamily