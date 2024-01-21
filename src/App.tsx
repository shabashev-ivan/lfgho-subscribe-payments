import React from 'react';
import Auth from "./Auth";
import {ConnectKitButton} from "connectkit";
import Dashboard from './Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
    return (
        <div className="App">
            <ConnectKitButton.Custom>
                {({isConnected}) => {
                    return isConnected ? <Dashboard/> : <Auth/>
                }}
            </ConnectKitButton.Custom>
            <ToastContainer />
        </div>
    );
}

export default App;
