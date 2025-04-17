export interface KeyboardCell {
  key: string
  rowspan?: number
  colspan?: number
}

export type KeyboardLayout = KeyboardCell[][]
