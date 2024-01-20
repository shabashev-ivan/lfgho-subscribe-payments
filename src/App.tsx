import React from 'react';
import Auth from "./Auth";
import {ConnectKitButton} from "connectkit";

function App() {
    return (
        <div className="App">
            <ConnectKitButton.Custom>
                {({isConnected}) => {
                    return isConnected ? 'logged' : <Auth/>
                }}
            </ConnectKitButton.Custom>
            <Auth></Auth>
        </div>
    );
}

export default App;
