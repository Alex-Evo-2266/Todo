import { AuthProvider } from 'alex-evo-sh-auth'
import { RoutesComponent } from './routs'
import { ColorProvider, SizeProvider, SneckbarProvider } from 'alex-evo-sh-ui-kit'
import './i18n'
import { AUTH_API, AUTH_FRONTEND_API } from '../consts'

function App() {
  return (
    <AuthProvider
        authUrl={AUTH_API}
        authFrontendUrl={AUTH_FRONTEND_API}
    >
      <ColorProvider>
      <SneckbarProvider>
        <SizeProvider>
          <RoutesComponent/>
        </SizeProvider>
      </SneckbarProvider>
      </ColorProvider>
    </AuthProvider>
  )
}

export default App
