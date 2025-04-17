import * as Keys from '../keys'
import { KeyboardLayout } from './types'

const numberLayout: KeyboardLayout = [
  [
    {
      key: Keys.ONE,
    },
    {
      key: Keys.TWO,
    },
    {
      key: Keys.THREE,
    },
    {
      key: Keys.DEL,
      rowspan: 2,
    },
  ],
  [
    {
      key: Keys.FOUR,
    },
    {
      key: Keys.FIVE,
    },
    {
      key: Keys.SIX,
    },
  ],
  [
    {
      key: Keys.SEVEN,
    },
    {
      key: Keys.EIGHT,
    },
    {
      key: Keys.NINE,
    },
    {
      key: Keys.ENTER,
      rowspan: 2,
    },
  ],
  [
    {
      key: Keys.DOT,
    },
    {
      key: Keys.ZERO,
    },
    {
      key: Keys.ESC,
    },
  ],
]

export default numberLayout
