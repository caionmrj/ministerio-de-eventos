import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import MobileLayout from './assets/layout/MobileLayout.jsx'

createRoot(document.getElementById('root')).render(
  <MobileLayout>
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  </MobileLayout>
)
