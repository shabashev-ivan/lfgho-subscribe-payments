import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {CircularProgress, IconButton, Paper, TableContainer} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";

import {useAccount} from 'wagmi'
import config from "./ethConfig";
import recABI from './abi/rec'
import {useEffect, useState} from "react";
import {readContract} from '@wagmi/core'
import {prepareWriteContract, writeContract} from "wagmi/actions";

interface Subscription {
    tokenAddress: string,
    recipient: string,
    interval: string,
    amount: number,
    completedPayments: number,
    paymentsRequired: number,
    lastPayment: Date,
    id: bigint,
}

const intervalsMap: Record<number, string> = {
    86400: 'Every day',
    604800: 'Every week',
    2592000: 'Every month',
}

export default function Subscriptions({createdCounter}: { createdCounter: number }) {
    const [isLoading, setLoading] = useState(true)
    const [rows, setRows] = useState<Subscription[]>([])

    const {address} = useAccount()
    const [subscriptionIds, setSubscriptionsIds] = useState<bigint[]>([])
    if (!address) throw new Error('No account')

    const loadSubscriptions = () => {
        setLoading(true)
        readContract({
            address: `0x${process.env.REACT_APP_REC_TOKEN.split('0x')[1]}`,
            abi: recABI,
            functionName: 'getUserSubscriptions',
            args: [address],
        }).then(data => {
            if (data) {
                const res = []
                for (const elem of data) {
                    res.push(elem)
                }
                setSubscriptionsIds(res as unknown as bigint[]);
            }
        })
    }

    const cancelSubscribe = async (id: bigint) => {
        const configCancel = await prepareWriteContract({
            address: `0x${process.env.REACT_APP_REC_TOKEN.split('0x')[1]}`,
            abi: recABI,
            functionName: 'cancelSubscription',
            args: [id]
        });
        await writeContract(configCancel);
        setSubscriptionsIds(
            subscriptionIds.filter(item => {
                return item !== id
            })
        )
    }

    useEffect(() => {
        loadSubscriptions()
    }, [address, createdCounter])

    useEffect(() => {
        const promRes = Promise.all((subscriptionIds as unknown as bigint[]).map(async (id: bigint) => {
            return {
                ...await readContract({
                    ...config,
                    address: `0x${process.env.REACT_APP_REC_TOKEN.split('0x')[1]}`,
                    abi: recABI,
                    functionName: 'getSubscription',
                    args: [id],
                }),
                id,
            }
        }))
        promRes.then(res => {
            const rows: Subscription[] = res.map(item => {
                return {
                    tokenAddress: item.tokenAddress,
                    recipient: item.recipient,
                    amount: Number(item.amount),
                    interval: intervalsMap[Number(item.interval)],
                    lastPayment: new Date(Number(item.lastPayment)),
                    completedPayments: Number(item.completedPayments),
                    paymentsRequired: Number(item.paymentsRequired),
                    id: item.id,
                }
            }).filter(item => item.paymentsRequired)
            setRows(rows)
            setLoading(false)
        });
    }, [subscriptionIds])
    return (
        <TableContainer component={Paper} style={{marginBottom: 16}}>
            <Typography style={{marginLeft: 16, marginTop: 16}} component="h2" variant="h6">
                Active subscriptions
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Last payment date</TableCell>
                        <TableCell>Recepient</TableCell>
                        <TableCell>Interval</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payments</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                {
                    isLoading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell><CircularProgress/></TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{String(row.lastPayment.toDateString())}</TableCell>
                                    <TableCell>{row.recipient}</TableCell>
                                    <TableCell>{row.interval}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.completedPayments}/{row.paymentsRequired}</TableCell>
                                    <TableCell onClick={() => cancelSubscribe(row.id)}>
                                        <IconButton aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )
                }
            </Table>
        </TableContainer>
    );
}