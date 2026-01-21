# n8n-nodes-zcash

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with the **Zcash blockchain**. This node provides access to transparent and shielded transaction capabilities, viewing keys, encrypted memos, and core blockchain operations via zcashd RPC.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Zcash](https://img.shields.io/badge/Zcash-blockchain-F4B728)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

| Resource | Operations | Description |
|----------|------------|-------------|
| **Wallet** | 8 | Balance, addresses, transactions, backup |
| **Transaction** | 7 | Send, decode, sign, broadcast, list UTXOs |
| **Block** | 7 | Block data, headers, chain info, difficulty |
| **Shielded** | 9 | z_sendmany with memos, operations, balances |
| **Keys** | 6 | Export/import viewing and spending keys |
| **Mining** | 5 | Mining info, hashrate, block templates |
| **Network** | 6 | Peers, connections, node management |
| **Utility** | 6 | Fee estimation, message signing, help |

### Trigger Events

Real-time blockchain monitoring:
- New blocks
- Address activity
- Balance changes
- Transaction confirmations
- Large transactions

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-zcash`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-zcash

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-zcash.git
cd n8n-nodes-zcash

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-zcash

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description | Example |
|-------|-------------|---------|
| Host | zcashd RPC host | `localhost` |
| Port | RPC port | `8232` (mainnet), `18232` (testnet) |
| Username | RPC username | From `zcash.conf` |
| Password | RPC password | From `zcash.conf` |
| Use SSL | Enable HTTPS | `false` |
| Network | Target network | `mainnet`, `testnet`, `regtest` |

### zcash.conf Example

```ini
rpcuser=yourusername
rpcpassword=yourpassword
rpcallowip=127.0.0.1
server=1
```

## Resources & Operations

### Wallet

- **Get Balance** - Get wallet balance with optional confirmations filter
- **Get New Address** - Generate a new transparent address
- **List Addresses** - List all addresses with balances
- **List Transactions** - List recent transactions
- **Send To Address** - Send ZEC to a transparent address
- **Validate Address** - Check if an address is valid
- **Get Wallet Info** - Get wallet status and details
- **Backup Wallet** - Create wallet backup file

### Transaction

- **Get Transaction** - Get transaction details by ID
- **Get Raw Transaction** - Get raw transaction hex/JSON
- **Send Raw Transaction** - Broadcast a signed transaction
- **Decode Raw Transaction** - Decode transaction hex to JSON
- **Create Raw Transaction** - Create unsigned transaction
- **Sign Raw Transaction** - Sign a raw transaction
- **List Unspent** - List unspent transaction outputs

### Block

- **Get Block** - Get block data by hash
- **Get Block Count** - Get current chain height
- **Get Block Hash** - Get block hash by height
- **Get Best Block Hash** - Get latest block hash
- **Get Block Header** - Get block header information
- **Get Blockchain Info** - Get chain state information
- **Get Difficulty** - Get current mining difficulty

### Shielded

- **Z Get Balance** - Get balance of a z-address
- **Z Get New Address** - Generate new shielded address
- **Z List Addresses** - List all shielded addresses
- **Z Send Many** - Send shielded transaction with memo
- **Z Get Operation Status** - Check async operation status
- **Z Get Operation Result** - Get completed operation result
- **Z List Operations** - List all operation IDs
- **Z View Transaction** - View shielded transaction details
- **Z Get Total Balance** - Get combined transparent/private balance

### Keys

- **Export Viewing Key** - Export viewing key for watch-only
- **Import Viewing Key** - Import viewing key
- **Export Spending Key** - Export spending key (dangerous)
- **Import Spending Key** - Import spending key
- **Z Export Key** - Export z-address key
- **Z Import Key** - Import z-address key

### Mining

- **Get Mining Info** - Get mining status
- **Get Network Hashrate** - Get estimated network hashrate
- **Get Block Template** - Get template for mining
- **Submit Block** - Submit mined block
- **Get Network Sol/s** - Get network solutions per second

### Network

- **Get Network Info** - Get network configuration
- **Get Peer Info** - Get connected peer details
- **Get Connection Count** - Get number of connections
- **Add Node** - Add a peer node
- **Get Added Node Info** - Get manually added node info
- **Disconnect Node** - Disconnect a peer

### Utility

- **Estimate Fee** - Estimate transaction fee
- **Sign Message** - Sign message with address
- **Verify Message** - Verify signed message
- **Get Info** - Get node info (deprecated)
- **Help** - Get RPC help
- **Stop** - Stop zcashd

## Trigger Node

The Zcash Trigger node monitors the blockchain for events:

| Event | Description |
|-------|-------------|
| New Block | Fires when a new block is mined |
| Address Activity | Fires when an address sends/receives |
| Balance Change | Fires when wallet balance changes |
| Transaction Confirmed | Fires when TX reaches N confirmations |
| Large Transaction | Fires for transactions above threshold |

## Usage Examples

### Get Wallet Balance

```json
{
  "resource": "wallet",
  "operation": "getBalance",
  "minConfirmations": 1
}
```

### Send Shielded Transaction

```json
{
  "resource": "shielded",
  "operation": "zSendMany",
  "fromAddress": "zs1...",
  "toAddress": "zs1...",
  "amount": 1.5,
  "memo": "Payment for services"
}
```

### Monitor New Blocks

Use the Zcash Trigger with:
- Event: `New Block`
- Poll interval: 60 seconds

## Zcash Concepts

### Address Types

| Type | Prefix | Privacy |
|------|--------|---------|
| Transparent | `t1`, `t3` | Public (like Bitcoin) |
| Sapling | `zs` | Private (shielded) |
| Unified | `u1` | Multi-protocol |

### Shielded Transactions

Zcash's shielded transactions use zero-knowledge proofs (zk-SNARKs) to hide sender, receiver, and amount while still allowing network validation.

### Memos

Shielded transactions can include encrypted memos (up to 512 bytes) visible only to parties with the viewing key.

## Networks

| Network | RPC Port | Use Case |
|---------|----------|----------|
| Mainnet | 8232 | Production |
| Testnet | 18232 | Testing |
| Regtest | 18443 | Development |

## Error Handling

The node includes comprehensive error handling:

- RPC connection failures return descriptive errors
- Invalid addresses are validated before sending
- Operation status polling for async shielded transactions
- Continue-on-fail support for batch operations

## Security Best Practices

1. **Never expose RPC to the internet** - Use localhost or VPN
2. **Use strong RPC credentials** - Generate secure passwords
3. **Backup your wallet** - Use the Backup Wallet operation
4. **Test with testnet first** - Verify workflows before mainnet
5. **Protect spending keys** - Export only when necessary

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Test
npm test
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-zcash/issues)
- **Email**: support@velobpa.com
- **Docs**: [Zcash RPC Documentation](https://zcash.readthedocs.io/)

## Acknowledgments

- [Zcash Foundation](https://www.zfnd.org/) for the Zcash protocol
- [Electric Coin Company](https://electriccoin.co/) for zcashd
- [n8n](https://n8n.io/) for the workflow automation platform
