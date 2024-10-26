import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import appStore from "./slices/appStore"
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store ={appStore} >
      <BrowserRouter>
        <ScrollToTop/>
          <App />
        <Toaster/>
      </BrowserRouter>
    </Provider>
  </>
);


