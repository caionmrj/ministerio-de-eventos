import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import MobileLayout from './assets/layout/MobileLayout.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MobileLayout>
          <App />
        </MobileLayout>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
