import number from './number'
import tel from './tel'
import { KeyboardLayout } from './types'

interface KeyboardLayouts {
  [key: string]: KeyboardLayout
}

const layouts: KeyboardLayouts = {
  number,
  tel,
}

export default layouts
