import { AuthProvider } from 'alex-evo-sh-auth'
import { RoutesComponent } from './routs'
import { SizeProvider, SneckbarProvider } from 'alex-evo-sh-ui-kit'
import './i18n'

function App() {
  return (
    <AuthProvider
        authUrl="/api-auth"
        authFrontendUrl="/auth-service"
    >
      <SneckbarProvider>
        <SizeProvider>
          <RoutesComponent/>
        </SizeProvider>
      </SneckbarProvider>
    </AuthProvider>
  )
}

export default App
