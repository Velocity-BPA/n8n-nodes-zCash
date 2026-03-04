# n8n-nodes-zcash

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Zcash blockchain operations, featuring 5 essential resources including wallet management, shielded transactions, blockchain queries, mining operations, and transaction processing with full support for both transparent and private Zcash operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Zcash](https://img.shields.io/badge/Zcash-ZEC-gold)
![Privacy](https://img.shields.io/badge/Privacy-Enabled-green)
![zk-SNARKs](https://img.shields.io/badge/zk--SNARKs-Supported-purple)

## Features

- **Wallet Operations** - Create, manage, and query Zcash wallets with full address support
- **Shielded Transactions** - Execute private transactions using zk-SNARKs technology
- **Transparent Operations** - Handle public Zcash transactions and address management
- **Blockchain Queries** - Access block data, transaction history, and network statistics
- **Mining Integration** - Monitor mining operations and network hash rates
- **Balance Tracking** - Query both shielded and transparent balance information
- **Multi-Address Support** - Work with t-addresses, z-addresses, and unified addresses
- **Transaction Analysis** - Detailed transaction inspection and verification tools

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-zcash`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-zcash
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-zcash.git
cd n8n-nodes-zcash
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-zcash
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Zcash node RPC API key or authentication token | Yes |
| Node URL | Zcash node RPC endpoint (e.g., http://localhost:8232) | Yes |
| Username | RPC username for basic authentication | No |
| Password | RPC password for basic authentication | No |
| SSL Certificate | Custom SSL certificate for secure connections | No |

## Resources & Operations

### 1. Wallet

| Operation | Description |
|-----------|-------------|
| Create Address | Generate new t-addresses, z-addresses, or unified addresses |
| Get Balance | Retrieve wallet balance for transparent and shielded pools |
| List Addresses | Get all addresses associated with the wallet |
| Export Private Key | Export private key for a specific address |
| Import Private Key | Import an existing private key into the wallet |
| Backup Wallet | Create a backup of the wallet data |
| List Transactions | Get transaction history for the wallet |
| Validate Address | Verify if an address is valid and get address info |

### 2. ShieldedOperations

| Operation | Description |
|-----------|-------------|
| Shield Funds | Move funds from transparent to shielded pool |
| Deshield Funds | Move funds from shielded to transparent pool |
| Private Send | Send shielded transaction between z-addresses |
| Get Shielded Balance | Query balance in shielded pools (Sprout/Sapling/Orchard) |
| List Shielded Addresses | Get all z-addresses in the wallet |
| Create Shielded Address | Generate new z-address for private transactions |
| Get Operation Status | Check status of asynchronous shielded operations |
| List Operations | Get all pending and completed shielded operations |

### 3. Transactions

| Operation | Description |
|-----------|-------------|
| Send Transaction | Send ZEC to transparent or shielded addresses |
| Get Transaction | Retrieve detailed transaction information |
| List Transactions | Get transaction history with filtering options |
| Create Raw Transaction | Build unsigned transaction for manual signing |
| Sign Transaction | Sign a raw transaction with wallet keys |
| Broadcast Transaction | Submit signed transaction to the network |
| Estimate Fee | Calculate transaction fees for different priority levels |
| Decode Transaction | Parse and decode raw transaction data |

### 4. Blockchain

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block data by height or hash |
| Get Block Count | Get current blockchain height |
| Get Block Hash | Get block hash for specific height |
| Get Chain Info | Retrieve blockchain network information |
| Get Network Info | Get network statistics and peer information |
| Get Memory Pool | List unconfirmed transactions in mempool |
| Get Difficulty | Retrieve current mining difficulty |
| Get Network Hash Rate | Get current network hash rate |

### 5. Mining

| Operation | Description |
|-----------|-------------|
| Get Mining Info | Retrieve current mining statistics |
| Get Hash Rate | Get local or network hash rate information |
| Submit Block | Submit mined block to the network |
| Get Block Template | Get block template for mining |
| Priority Transactions | Get high-priority transactions for mining |
| Generate Blocks | Generate blocks (testnet/regtest only) |
| Get Network Sol Rate | Get network solutions per second |
| Estimate Network Hash | Estimate total network hash power |

## Usage Examples

```javascript
// Shield transparent funds to private z-address
const shieldOperation = {
  "fromAddress": "t1YourTransparentAddress123...",
  "toAddress": "zs1yourshieldedaddress456...",
  "amount": 5.0,
  "memo": "Private transaction memo"
};

// Send private shielded transaction
const privateTransaction = {
  "fromAddress": "zs1sendershieldedaddress789...",
  "toAddress": "zs1receivershieldedaddress012...",
  "amount": 2.5,
  "memo": "Confidential payment",
  "fee": 0.0001
};

// Query shielded balance across all pools
const balanceQuery = {
  "address": "zs1yourshieldedaddress345...",
  "minConfirmations": 1,
  "includeWatchonly": false
};

// Get transaction details with full disclosure
const transactionDetails = {
  "txid": "a1b2c3d4e5f6789012345678901234567890abcdef...",
  "includeWatchonly": true,
  "verbose": true
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Insufficient Funds | Not enough ZEC balance for transaction | Check wallet balance and ensure sufficient funds |
| Invalid Address | Malformed or unsupported address format | Verify address format (t-addr, z-addr, or unified) |
| Operation Timeout | Shielded operation taking too long | Check operation status and wait for completion |
| Node Connection Failed | Unable to connect to Zcash node | Verify node URL and authentication credentials |
| Invalid Private Key | Malformed or incorrect private key | Ensure private key format is valid for address type |
| Transaction Too Large | Transaction exceeds size limits | Reduce number of inputs/outputs or split transaction |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-zcash/issues)
- **Zcash Documentation**: [Zcash RPC API Reference](https://zcash.github.io/rpc/)
- **Zcash Community**: [Zcash Community Forum](https://forum.zcashcommunity.com/)