import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {AppProvider} from './context/appContext.tsx'
import { ThemeProvider } from "./context/ThemeContext.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
