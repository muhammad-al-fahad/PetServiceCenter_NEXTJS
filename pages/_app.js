import '../styles/globals.css'
import Layout from '../components/layout'
import Footer from '../components/footer'
import { DataProvider } from '../redux/store'
import { GoogleOAuthProvider } from '@react-oauth/google'

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
        <Layout>
          <GoogleOAuthProvider clientId="557184705297-s74ars7nu4dgcg50fkr496ivngnnipgi.apps.googleusercontent.com">
            <div style={{minHeight: '50vh'}}>
              <Component {...pageProps}/>
            </div>
          </GoogleOAuthProvider>
        </Layout>
        <Footer/>
    </DataProvider>
  )
}

export default MyApp
