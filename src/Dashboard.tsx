/* eslint-disable */
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {ConnectKitButton} from "connectkit";
import {
    ThemeProvider,
    createTheme,
} from '@mui/material';
import Container from "@mui/material/Container";
import Subscriptions from "./Subscriptions";
import recABI from './abi/rec'
import SubscribeForm from './SubscribeForm';
import {createSubscribeData} from "./interfaces";
import {useState} from "react";
import {prepareWriteContract, writeContract} from 'wagmi/actions'
import {erc20ABI} from "@wagmi/core";


const defaultTheme = createTheme();

export default function Dashboard() {
    const [isLoading, setLoading] = useState(false)
    const [createdCounter, setCounter] = useState(0)

    const createSubscribe = async (
        data: createSubscribeData,
    ) => {
        setLoading(true)
        try {
            const configApprove = await prepareWriteContract({
                address: `0x${data.token.split('0x')[1]}`,
                abi: erc20ABI,
                functionName: 'approve',
                args: [`0x${data.recepient.split('0x')[1]}`, BigInt(data.amount)]
            });
            await writeContract(configApprove);
            const configSubscribe = await prepareWriteContract({
                address: `0x${process.env.REACT_APP_REC_TOKEN.split('0x')[1]}`,
                abi: recABI,
                functionName: 'createSubscription',
                args: [
                    `0x${data.token.split('0x')[1]}`,
                    `0x${data.recepient.split('0x')[1]}`,
                    BigInt(data.interval),
                    BigInt(data.amount),
                    BigInt(data.times),
                ]
            });
            await writeContract(configSubscribe);
            setCounter(createdCounter + 1)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    };

    const handleCreate = (formData: createSubscribeData) => {
        createSubscribe(formData)
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <MuiAppBar position="relative">
                    <Toolbar>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            LFGHO Subscribe Payments
                        </Typography>
                        <ConnectKitButton/>
                    </Toolbar>
                </MuiAppBar>
            </Box>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                }}
            >
                <Container component="main" maxWidth="md">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h2" variant="h5">
                            Create subscribe
                        </Typography>
                        <SubscribeForm handleCreate={handleCreate} isLoading={isLoading}/>
                    </Box>
                    <Subscriptions createdCounter={createdCounter}/>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
