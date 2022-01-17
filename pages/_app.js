import fetchJson from 'lib/fetchJson';
import { SWRConfig } from 'swr';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  
  return <SWRConfig value={{ 
    fetcher: fetchJson,
    onError: (err) => {
      console.log("SWRConfig", err);
    }
   }}
  >
        <Component {...pageProps} />
  </SWRConfig>
}

export default MyApp
