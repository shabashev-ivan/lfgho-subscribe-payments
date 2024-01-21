import {Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import {createSubscribeData} from "./interfaces";

export default function SubscribeForm(props: {
    handleCreate: (data: createSubscribeData) => void,
    isLoading: boolean,
}) {
    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (props.isLoading) return
        props.handleCreate({
            recepient: address,
            amount,
            token: ercToken,
            interval: interval,
            times: times,
        })
    }
    const [times, setTimes] = React.useState(3)
    const handleTimesChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (value > 0) setTimes(value)
    }

    const [amount, setAmount] = React.useState(10);
    const handleAmountChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && value > 0) {
            setAmount(value);
        }
    };

    const [ercToken, setErcToken] = React.useState('0x9b1c5dedc56ca19336ea8659c4f3ed81d837af07');
    const handleTokenChange = (event: SelectChangeEvent) => {
        setErcToken(event.target.value as string);
    };

    const [address, setAddress] = React.useState('');
    const handleAddressChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setAddress(event.target.value as string);
    };

    const [interval, setInterval] = React.useState(2592000);
    const handleIntervalChange = (event: SelectChangeEvent) => {
        setInterval(Number(event.target.value));
    };

    return <Box component="form" noValidate onSubmit={handleForm} sx={{mt: 3}}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
                <TextField
                    required
                    fullWidth
                    id="address"
                    label="recepient address"
                    name="addess"
                    value={address}
                    onChange={handleAddressChange}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    required
                    fullWidth
                    name="amount"
                    label="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => {
                        e.preventDefault()
                        if (!props.isLoading) handleAmountChange(e)
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="erc-label">ERC-20 Token</InputLabel>
                    <Select
                        labelId="erc-label"
                        id="erc-select"
                        value={ercToken}
                        label="ERC-20 Token"
                        onChange={handleTokenChange}
                    >
                        <MenuItem value={'0x9b1c5dedc56ca19336ea8659c4f3ed81d837af07'}>Test Token</MenuItem>
                        <MenuItem value={'0xcbe9771ed31e761b744d3cb9ef78a1f32dd99211'}>GHO Görli Token</MenuItem>
                        <MenuItem value={'0xd77b79be3e85351ff0cbe78f1b58cf8d1064047c'}>DAI Görli Token</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <InputLabel id="interval-label">Interval</InputLabel>
                    <Select
                        labelId="interval-label"
                        id="interval-select"
                        value={String(interval)}
                        label="Payment interval"
                        onChange={handleIntervalChange}
                    >
                        <MenuItem value={86400}>Every day</MenuItem>
                        <MenuItem value={604800}>Every week</MenuItem>
                        <MenuItem value={2592000}>Every month</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
                <TextField
                    required
                    fullWidth
                    type="number"
                    id="times"
                    label="times"
                    name="times"
                    value={times}
                    onChange={(e) => handleTimesChange(e)}
                />
            </Grid>
        </Grid>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 2, mb: 2}}
        >
            {props.isLoading ? 'Loading...' : 'Subscribe'}
        </Button>
    </Box>
}