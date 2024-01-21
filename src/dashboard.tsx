import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {ConnectKitButton} from "connectkit";
import {
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    TextField,
    ThemeProvider,
    createTheme,
    FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";

const defaultTheme = createTheme();

export default function Dashboard() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(data);
    };

    const [ercToken, setErcToken] = React.useState('');

    const handleTokenChange = (event: SelectChangeEvent) => {
        setErcToken(event.target.value as string);
    };

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
            <Container component="main" maxWidth="sm">
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
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    required
                                    fullWidth
                                    id="address"
                                    label="Receiver address"
                                    name="addess"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    required
                                    fullWidth
                                    name="amount"
                                    label="amount"
                                    id="amount"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">ERC-20 Token</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={ercToken}
                                        label="ERC-20 Token"
                                        onChange={handleTokenChange}
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="period"
                                    label="period"
                                    name="period"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    required
                                    fullWidth
                                    id="times"
                                    label="times"
                                    name="times"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 2, mb: 2}}
                        >
                            Subscribe
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
