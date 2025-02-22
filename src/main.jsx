import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './main.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}> {/* Provider로 App 감싸기 */}
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
