import { AuthProvider } from 'alex-evo-sh-auth'
import { RoutesComponent } from './routs'
import { ColorProvider, SizeProvider, SneckbarProvider } from 'alex-evo-sh-ui-kit'
import './i18n'
import { authManager } from './config'

function App() {
  return (
    <AuthProvider
      authManager={authManager}
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
