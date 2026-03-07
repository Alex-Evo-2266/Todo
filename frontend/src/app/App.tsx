import { AuthProvider } from 'alex-evo-sh-auth'
import { RoutesComponent } from './routs'

function App() {
  return (
    <AuthProvider
        authUrl="/api-auth"
        authFrontendUrl="/auth-service"
    >
      <RoutesComponent/>
    </AuthProvider>
  )
}

export default App
