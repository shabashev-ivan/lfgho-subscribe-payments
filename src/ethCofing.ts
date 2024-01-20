import {createConfig} from "wagmi";
import {getDefaultConfig} from "connectkit";
import chains from "./chains";

const config = createConfig(
    getDefaultConfig({
        infuraId: process.env.REACT_APP_INFURA_ID,
        walletConnectProjectId: process.env.REACT_APP_PROJECT_ID,
        appName: "LFGHO Subsciption",
        appDescription: "App for subscribe payments",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
        chains,
    }),
);

export default config;