// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RecSub {
    address internal owner;

    constructor() {
        owner = msg.sender;
    }

    event TransferSuccessful(
        uint256 indexed subscriptionId,
        uint256 amount,
        address indexed sender,
        address indexed recipient
    );
    event TransferFailed(
        uint256 indexed subscriptionId,
        uint256 amount,
        address indexed sender,
        address indexed recipient
    );
    event SubscriptionCompleted(
        uint256 indexed subscriptionId,
        address indexed sender
    );

    struct Subscription {
        address tokenAddress;
        address sender;
        address recipient;
        uint256 interval;
        uint256 amount;
        uint256 completedPayments;
        uint256 paymentsRequired;
        uint256 lastPayment;
    }

    uint256 internal nextSubscriptionId = 1;

    uint256[] internal keys = [0];
    mapping(uint256 => Subscription) internal subscriptions;
    mapping(address => uint256[]) internal userSubscriptions;

    function getUserSubscriptions(address _address)
    public
    view
    returns (uint256[] memory)
    {
        return userSubscriptions[_address];
    }

    function getSubscription(uint256 _id)
    public
    view
    returns (Subscription memory)
    {
        return subscriptions[_id];
    }

    function getAllSubscriptions() public view returns (uint256[] memory) {
        return keys;
    }

    function getSubscriptionsToAddress(address _address) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < keys.length; i++)  {
            if (keys[i] == 0) {
                continue;
            }
            count++;
        }

        uint256[] memory subs = new uint256[](count);
        count = 0;
        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i] == 0) {
                continue;
            }
            if (subscriptions[keys[i]].recipient != _address) {
                continue;
            }
            subs[count] = keys[i];
            count++;
        }

        return subs;
    }

    function createSubscription(
        address _tokenAddress,
        address _recipient,
        uint256 _interval,
        uint256 _amount,
        uint256 _paymentsRequired
    ) public {
        require(
            IERC20(_tokenAddress).allowance(msg.sender, address(this)) >=
            _amount,
            "Insufficient allowance"
        );

        uint256 subscriptionId = nextSubscriptionId++;
        subscriptions[subscriptionId] = Subscription({
            tokenAddress: _tokenAddress,
            sender: msg.sender,
            recipient: _recipient,
            interval: _interval,
            amount: _amount,
            completedPayments: 0,
            paymentsRequired: _paymentsRequired,
            lastPayment: 0
        });
        userSubscriptions[msg.sender].push(subscriptionId);
        keys.push(subscriptionId);
    }

    function deleteSubscription(uint256 _id) internal {
        uint256[] storage userSubs = userSubscriptions[msg.sender];
        for (uint256 i = 0; i < userSubs.length; i++) {
            if (userSubs[i] == _id) {
                delete userSubs[i];
                break;
            }
        }

        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i] == _id) {
                delete keys[i];
                break;
            }
        }

        delete subscriptions[_id];
    }

    function cancelSubscription(uint256 _id) public {
        Subscription memory subscription = subscriptions[_id];

        require(
            msg.sender == subscription.sender,
            "You are not the owner of this subscription."
        );

        deleteSubscription(_id);
    }

    function executePayments(uint256[] memory _ids) public {
        for (uint256 i = 0; i < _ids.length; i++) {
            Subscription storage subscription = subscriptions[_ids[i]];
            if (subscription.paymentsRequired == 0) {
                continue;
            }

            if (
                subscription.lastPayment + subscription.interval >
                block.timestamp
            ) {
                continue;
            }
            try
            IERC20(subscription.tokenAddress).transferFrom(
                subscription.sender,
                subscription.recipient,
                subscription.amount
            )
            {
                subscription.completedPayments++;
                subscription.lastPayment = block.timestamp;
                emit TransferSuccessful(
                    _ids[i],
                    subscription.amount,
                    subscription.sender,
                    subscription.recipient
                );
                if (
                    subscription.completedPayments >=
                    subscription.paymentsRequired
                ) {
                    deleteSubscription(_ids[i]);
                    emit SubscriptionCompleted(_ids[i], subscription.sender);
                }
            } catch {
                emit TransferFailed(
                    _ids[i],
                    subscription.amount,
                    subscription.sender,
                    subscription.recipient
                );
                continue;
            }
        }
    }
}