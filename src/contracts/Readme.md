# `RecSub` Contract

## Overview
The `RecSub` contract, written in Solidity, is designed to manage recurring payments (subscriptions) on the Ethereum blockchain. It allows users to create, track, and manage subscriptions for ERC20 tokens. This contract facilitates an automated process for collecting payments at set intervals, simplifying regular transactions between parties.

## Key Features
### Creating Subscriptions
- Users can create subscriptions by specifying the ERC20 token address, recipient, payment intervals, payment amount, and total number of payments.
- To initiate a subscription, the user must have sufficient allowance to transfer the specified token amount.

### Managing Subscriptions
- Users can view their active subscriptions and retrieve information about any subscription by its ID.
- The owner of a subscription can cancel it at any time.

### Executing Payments
- The `executePayments` function should be called by a backend service that tracks when payments for each subscription are due. This automates the process of transferring funds from the sender to the recipient on schedule.
- If a payment cannot be executed (for example, due to insufficient balance or allowances), the contract generates a failed transfer event.

### Events
- `TransferSuccessful`: Triggered when a transfer of funds is successful.
- `TransferFailed`: Triggered if a fund transfer fails.
- `SubscriptionCompleted`: Triggered when a subscription is fully paid and no longer active.

## Requirements
- Solidity ^0.8.23.
- OpenZeppelin ERC20.

## License
The contract is distributed under the MIT License.