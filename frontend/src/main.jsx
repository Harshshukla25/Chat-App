
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from "react-redux"
import { store } from './redux/store.js'
import { ThemeProvider } from './context/ThemeContext.jsx'

export const serverUrl="https://chat-app-0fpq.onrender.com"


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
  </BrowserRouter>
   
 
)
