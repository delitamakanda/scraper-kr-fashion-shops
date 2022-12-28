import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders header', () => {
    render(<App />)
    screen.debug()

    // screen.debug() will output the following:
  });
});
