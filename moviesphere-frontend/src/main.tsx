import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import './index.css';
import { syncLanguage } from './i18n/languageSync';

// Get stored language (single source of truth start point)
const storedLang = (localStorage.getItem('language') as 'en' | 'ar') || 'en';

// Sync app language once on startup
syncLanguage(storedLang);

// Keep Redux + localStorage aligned initially
store.dispatch({ type: 'movies/setLanguage', payload: storedLang });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);