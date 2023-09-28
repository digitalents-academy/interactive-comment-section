import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import notiReducer from './reducers/notiReducer.js';
import userReducer from './reducers/userReducer.js';

const store = configureStore({ reducer: { 
  notification: notiReducer,
  user: userReducer
 }})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
  </React.StrictMode>
  </Provider>
  
)
