import {configure} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

const localStorageMock = {
  getItem: jest.fn(() => '0'),
  setItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

configure({adapter: new Adapter()})
