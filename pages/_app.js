import '../styles/globals.css'
import { StateContext } from '../context/ContextProvider'
function MyApp({ Component, pageProps }) {
  return (
    <StateContext>
      <Component {...pageProps} />
    </StateContext>
  )
}

export default MyApp
