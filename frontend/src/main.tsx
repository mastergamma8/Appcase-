import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { mockTelegramEnv, parseInitData } from '@telegram-apps/sdk-react';

const initializeTelegramSDK = () => {
  if (typeof window !== 'undefined') {
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      let shouldMock = true;
      try {
        const initDataRaw = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');
        if (initDataRaw) {
          parseInitData(initDataRaw);
          shouldMock = false;
        }
      } catch (e) {
        console.log('No valid Telegram data found, using mock');
      }

      if (shouldMock) {
        mockTelegramEnv({
          themeParams: {
            accentTextColor: '#6ab2f2',
            bgColor: '#1a1a2e',
            buttonColor: '#5288c1',
            buttonTextColor: '#ffffff',
            destructiveTextColor: '#ec3942',
            headerBgColor: '#1a1a2e',
            hintColor: '#708499',
            linkColor: '#6ab3f3',
            secondaryBgColor: '#16213e',
            sectionBgColor: '#1a1a2e',
            sectionHeaderTextColor: '#6ab3f3',
            subtitleTextColor: '#708499',
            textColor: '#f5f5f5',
          },
          initData: parseInitData([
            'user=' + encodeURIComponent(JSON.stringify({
              id: 99281932,
              first_name: 'Test',
              last_name: 'User',
              username: 'testuser',
              language_code: 'en',
              is_premium: true,
              allows_write_to_pm: true,
            })),
            'hash=placeholder_hash',
            'auth_date=1234567890',
            'start_param=debug',
            'chat_type=sender',
            'chat_instance=8428209589180549439',
          ].join('&')),
          initDataRaw: 'mock_init_data',
          version: '7.2',
          platform: 'tdesktop',
        });
      }
    }
  }
};

initializeTelegramSDK();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
