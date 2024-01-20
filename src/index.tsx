import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import {WagmiConfig} from "wagmi";
import {ConnectKitProvider} from "connectkit";
import config from "./ethCofing";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <CssBaseline/>
        <WagmiConfig config={config}>
            <ConnectKitProvider>
                <App/>
            </ConnectKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);
