# n8n-nodes-zcash

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Zcash blockchain operations, offering 6 comprehensive resources for wallet management, transaction processing, shielded pool operations, blockchain exploration, mining activities, and network monitoring. Built for privacy-focused blockchain automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Zcash](https://img.shields.io/badge/Zcash-ZEC-orange)
![Privacy](https://img.shields.io/badge/Privacy-Focused-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-purple)

## Features

- **Wallet Operations** - Complete wallet management including creation, balance checking, address generation, and backup/restore functionality
- **Transaction Processing** - Send, receive, and track both transparent and shielded transactions with full privacy controls
- **Shielded Pool Management** - Advanced privacy operations including note commitment, nullifier management, and zero-knowledge proof handling
- **Blockchain Exploration** - Query blocks, validate transactions, and access comprehensive blockchain data and statistics
- **Mining Integration** - Monitor mining operations, manage pools, track hashrates, and access mining statistics
- **Network Monitoring** - Real-time network status, peer management, consensus tracking, and protocol upgrade monitoring
- **Privacy-First Design** - Built-in support for Zcash's privacy features with transparent and shielded address handling
- **Enterprise Security** - Robust error handling, credential management, and audit logging for production environments

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
| API Key | Your Zcash node API access key | Yes |
| Node URL | Zcash node endpoint URL (default: http://localhost:8232) | Yes |
| Username | RPC username for node authentication | No |
| Password | RPC password for node authentication | No |
| SSL Verify | Enable SSL certificate verification | No |

## Resources & Operations

### 1. Wallet

| Operation | Description |
|-----------|-------------|
| Create Wallet | Generate a new Zcash wallet with optional encryption |
| Get Balance | Retrieve wallet balance for transparent and shielded funds |
| List Addresses | Get all wallet addresses (transparent and shielded) |
| Generate Address | Create new receiving addresses with specified type |
| Backup Wallet | Export wallet data and seed phrases securely |
| Restore Wallet | Import wallet from backup or seed phrase |
| Lock Wallet | Encrypt and lock wallet with passphrase |
| Unlock Wallet | Decrypt wallet for transaction operations |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send Transaction | Send ZEC to transparent or shielded addresses |
| Get Transaction | Retrieve transaction details by transaction ID |
| List Transactions | Get transaction history with filtering options |
| Create Raw Transaction | Build unsigned transaction for offline signing |
| Sign Transaction | Sign raw transaction with wallet private keys |
| Broadcast Transaction | Submit signed transaction to the network |
| Estimate Fee | Calculate optimal transaction fees |
| Validate Address | Verify address format and type |

### 3. ShieldedPool

| Operation | Description |
|-----------|-------------|
| Shield Funds | Move transparent funds to shielded pool |
| Deshield Funds | Move shielded funds to transparent addresses |
| Create Note | Generate new note commitments for privacy |
| Spend Note | Create nullifiers and spend shielded notes |
| List Notes | Retrieve all unspent notes in wallet |
| Generate Proof | Create zero-knowledge proofs for transactions |
| Verify Proof | Validate zero-knowledge proofs |
| Get Pool Status | Check shielded pool statistics and health |

### 4. Blockchain

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block data by height or hash |
| Get Block Hash | Get block hash for specific height |
| Get Block Height | Get current blockchain height |
| List Blocks | Retrieve multiple blocks with pagination |
| Get Chain Info | Get blockchain statistics and information |
| Validate Block | Verify block structure and consensus rules |
| Search | Search blockchain for addresses, transactions, or blocks |
| Get Difficulty | Retrieve current mining difficulty |

### 5. Mining

| Operation | Description |
|-----------|-------------|
| Get Mining Info | Retrieve current mining statistics |
| Start Mining | Begin mining operations with specified parameters |
| Stop Mining | Halt mining operations |
| Set Mining Pool | Configure mining pool connection |
| Get Hashrate | Retrieve current hashrate statistics |
| List Workers | Get connected mining workers status |
| Get Block Template | Retrieve mining block template |
| Submit Block | Submit solved block to network |

### 6. Network

| Operation | Description |
|-----------|-------------|
| Get Network Info | Retrieve network status and statistics |
| List Peers | Get connected peer information |
| Add Peer | Connect to specific network peer |
| Remove Peer | Disconnect from network peer |
| Get Node Status | Check local node health and sync status |
| Monitor Consensus | Track network consensus and fork detection |
| Check Upgrades | Monitor protocol upgrades and activation |
| Get Network Stats | Retrieve comprehensive network metrics |

## Usage Examples

```javascript
// Send shielded transaction for privacy
{
  "operation": "Send Transaction",
  "fromAddress": "zs1example...",
  "toAddress": "zs1recipient...",
  "amount": 0.5,
  "memo": "Private payment",
  "includeReplyTo": false
}
```

```javascript
// Shield transparent funds for privacy
{
  "operation": "Shield Funds",
  "fromAddress": "t1transparent...",
  "toShieldedAddress": "zs1shielded...",
  "amount": 10.0,
  "memo": "Moving to privacy pool"
}
```

```javascript
// Monitor blockchain for new transactions
{
  "operation": "List Transactions",
  "count": 50,
  "skip": 0,
  "includeWatchOnly": true,
  "category": "receive"
}
```

```javascript
// Check mining performance
{
  "operation": "Get Mining Info",
  "includeHashrate": true,
  "includeWorkers": true,
  "timeframe": "24h"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and node configuration |
| Insufficient Funds | Wallet balance too low for transaction | Check wallet balance and reduce amount |
| Invalid Address | Address format incorrect or unsupported | Validate address format for Zcash network |
| Node Unreachable | Cannot connect to Zcash node | Check node URL and network connectivity |
| Transaction Failed | Transaction rejected by network | Verify transaction parameters and fees |
| Wallet Locked | Wallet requires unlocking for operation | Unlock wallet with correct passphrase |

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
- **Zcash Documentation**: [Zcash Protocol Documentation](https://zcash.readthedocs.io/)
- **Community Forum**: [Zcash Community Forum](https://forum.zcashcommunity.com/)