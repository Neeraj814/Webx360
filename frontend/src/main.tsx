import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

// 1. ADD THIS IMPORT (Adjust the path if your context is elsewhere)
import { AuthProvider } from './contexts/AuthContext' 

const persistor = persistStore(store);
const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 2. WRAP THE APP HERE */}
        <AuthProvider> 
          <App />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)