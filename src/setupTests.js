const localStorageMock = {
  getItem: jest.fn(() => '0'),
  setItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
