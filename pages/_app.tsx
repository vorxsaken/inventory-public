import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from '@/components/theme-provider';
import type { AppPropsWithLayout } from '@/lib/types';
import { Provider } from 'react-redux';
import store from '../store'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {
            getLayout(
              <Component {...pageProps} />
            )
          }
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  )
}
