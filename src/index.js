import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";
import { HashRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { AllFirmsProvider } from './contexts/AllFirmsContext';
import { DatarProvider } from './contexts/DatarContext';
import { KharchaProvider } from './contexts/KharchaContext';
import { SamitiProvider } from './contexts/SamitiContext';
import { PhaadProvider } from './contexts/PhaadContext';
import { SikshanidhiProvider } from './contexts/SikshanidhiContext';
import { YajmanProvider } from './contexts/YajmanContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <UserProvider>
        <AllFirmsProvider>
          <PhaadProvider>
            <SikshanidhiProvider>
              <DatarProvider>
                <KharchaProvider>
                  <SamitiProvider>
                    <YajmanProvider>
                      <App />
                    </YajmanProvider>
                  </SamitiProvider>
                </KharchaProvider>
              </DatarProvider>
            </SikshanidhiProvider>
          </PhaadProvider>
        </AllFirmsProvider>
      </UserProvider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
