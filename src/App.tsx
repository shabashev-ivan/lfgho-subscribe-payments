import React from 'react';
import Auth from "./Auth";
import {ConnectKitButton} from "connectkit";
import Dashboard from './Dashboard';

function App() {
    return (
        <div className="App">
            <ConnectKitButton.Custom>
                {({isConnected}) => {
                    return isConnected ? <Dashboard/> : <Auth/>
                }}
            </ConnectKitButton.Custom>
        </div>
    );
}

export default App;
