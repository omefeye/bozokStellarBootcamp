# ⚡ VoltStellar - Decentralized EV Charging Network

A revolutionary electric vehicle charging platform built on the Stellar blockchain. VoltStellar connects EV drivers with charging stations while enabling community investment in charging infrastructure through tokenized ownership.

## 🎯 **Project Overview**

VoltStellar democratizes access to EV charging infrastructure by creating a decentralized network where anyone can find chargers, invest in charging stations, or list their own chargers. Built on Stellar blockchain, it enables instant XLM payments and fractional ownership of charging infrastructure.

### **🌟 Key Features**

#### **For EV Drivers**

- 🔍 **Find Chargers** - Search nearby charging stations with real-time availability
- ⚡ **Instant Payments** - Pay with Stellar (XLM) for fast, low-cost transactions
- 🗺️ **Smart Search** - Location-based filtering with multiple charger types
- 📱 **Real-time Status** - Live availability and pricing information
- 🔐 **Secure Wallet** - Non-custodial Freighter wallet integration

#### **For Investors**

- 💰 **Community Funding** - Invest in charging infrastructure projects
- 📊 **Transparent Returns** - Track funding progress and estimated APY
- 🎯 **Diversified Portfolio** - Multiple projects with different risk profiles
- 🔄 **Fractional Ownership** - Start investing from 100 XLM
- 🛡️ **Blockchain Security** - All transactions secured on Stellar

#### **For Charger Owners**

- 📝 **Easy Listing** - Simple wizard to list charging stations
- 💵 **Earn Revenue** - Generate passive income from charging sessions
- 🌐 **Community Support** - Optional crowdfunding from investors
- 📈 **Analytics** - Track usage and revenue performance
- 🔒 **Wallet-Gated** - Secure access with wallet authentication

#### **Platform Features**

- 🌐 **Multi-Charger Support** - Fast charge, standard, and home chargers
- ⚡ **Stellar Blockchain** - Fast, low-cost transactions
- 🎨 **Modern UI/UX** - Beautiful teal/slate dark theme
- 📱 **Responsive Design** - Optimized for all devices
- 🔔 **Smart Notifications** - Toast alerts for all actions

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ installed
- [Freighter Wallet](https://freighter.app/) browser extension
- Access to Stellar Testnet for development

### **Installation**

```bash
# Clone the repository
git clone https://github.com/omefeye/bozokStellarBootcamp
cd voltstellar

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ **Project Architecture**

### **Technology Stack**

| Component         | Technology               | Purpose                     |
| ----------------- | ------------------------ | --------------------------- |
| **Frontend**      | Next.js 15 + TypeScript  | React-based web application |
| **Styling**       | Tailwind CSS + shadcn/ui | Professional UI components  |
| **Blockchain**    | Stellar SDK              | Blockchain integration      |
| **Wallet**        | Freighter API            | Wallet connectivity         |
| **Icons**         | Lucide React             | Professional icon system    |
| **Notifications** | Sonner                   | Toast notifications         |

### **Directory Structure**

```
rwa-frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page with search and features
│   ├── find-chargers/     # Charger search and discovery
│   ├── invest/            # Investment opportunities
│   ├── list-charger/      # List new charging stations
│   ├── layout.tsx         # Root layout with Toaster
│   └── globals.css        # Global styles (teal/slate theme)
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── lib/
│   ├── types.ts           # TypeScript definitions
│   ├── stellar.ts         # Stellar SDK utilities
│   ├── contract.ts        # Smart contract client
│   └── utils.ts           # Helper functions
├── stores/
│   ├── wallet.ts          # Wallet state management
│   └── contract.ts        # Contract state management
└── public/                # Static assets
```

---

## 💼 **Smart Contract Integration**

### **Contract Details**

- **Contract ID**: `CBYQ6EVVIPTGRF6J565COVFI6HOEVBPZ7L5IWW47FLZMENXXA2D6P5DP`
- **Network**: Stellar Testnet
- **Asset**: VoltStellar Token (VOLT)
- **Type**: EV Charging Infrastructure Token
- **Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBYQ6EVVIPTGRF6J565COVFI6HOEVBPZ7L5IWW47FLZMENXXA2D6P5DP)
- **Deployment Date**: November 23, 2025
- **Total Supply**: 1,000,000 VOLT

> **📋 Full deployment details:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment documentation, testing commands, and troubleshooting guide.

### **Supported Operations**

#### **Core Token Operations**

| Operation          | Description                   | Status         |
| ------------------ | ----------------------------- | -------------- |
| `get_balance`      | Query user's token balance    | ✅ Implemented |
| `get_metadata`     | Retrieve asset information    | ✅ Implemented |
| `transfer`         | Send tokens between addresses | ✅ Implemented |
| `check_compliance` | Verify KYC/whitelist status   | ✅ Implemented |
| `get_supply`       | Get total token supply        | ✅ Implemented |
| `mint`             | Create new tokens (admin)     | 🔄 Admin only  |
| `burn`             | Destroy tokens (admin)        | 🔄 Admin only  |
| `pause`            | Pause contract operations     | 🔄 Admin only  |

#### **Advanced Features**

| Operation                      | Description                     | Status         |
| ------------------------------ | ------------------------------- | -------------- |
| `transfer_with_memo`           | Transfer with transaction note  | ✅ Implemented |
| `batch_transfer`               | Send to multiple recipients     | ✅ Implemented |
| `can_transfer`                 | Dry-run transfer validation     | ✅ Implemented |
| `get_all_holders`              | List all token holders          | ✅ Implemented |
| `get_holder_count`             | Count of active holders         | ✅ Implemented |
| `calculate_dividend_share`     | Calculate proportional dividend | ✅ Implemented |
| `has_voting_rights`            | Check governance eligibility    | ✅ Implemented |
| `get_token_value`              | Get per-token asset value       | ✅ Implemented |
| `lock_tokens`                  | Lock tokens for vesting period  | ✅ Implemented |
| `batch_update_compliance`      | Update multiple KYC records     | 🔄 Admin only  |
| `emergency_pause_and_snapshot` | Emergency contract freeze       | 🔄 Admin only  |

### **Extended Functionality Details**

#### **📝 Transfer with Memo**

Send tokens with a transaction note for transparent record-keeping:

```rust
transfer_with_memo(from, to, amount, "Q4 Dividend Payment")
```

#### **📊 Batch Operations**

Efficiently distribute tokens to multiple recipients (perfect for dividend payments):

```rust
batch_transfer(admin, [addr1, addr2, addr3], [100, 200, 150])
```

#### **🔍 Pre-Transfer Validation**

Check if a transfer would succeed before executing:

```rust
if can_transfer(sender, receiver, 500) {
    // Proceed with transfer
}
```

#### **💰 Dividend Distribution**

Calculate each holder's proportional share:

```rust
let share = calculate_dividend_share(holder, 10000) // Total dividend: 10000
```

#### **🗳️ Governance Rights**

Verify voting eligibility based on minimum balance:

```rust
if has_voting_rights(address, 1000) {
    // Can participate in governance
}
```

#### **💎 Token Valuation**

Get real-time value per token based on asset valuation:

```rust
let value_per_token = get_token_value() // Returns valuation / total_supply
```

#### **🔒 Token Lock-Up**

Lock tokens for vesting or regulatory compliance:

```rust
lock_tokens(owner, 5000, unlock_timestamp)
```

---

## 🎨 **User Interface Guide**

### **🏠 Dashboard Page (`/`)**

- Portfolio value and performance metrics
- Compliance status indicators
- Quick action buttons
- Investment opportunities overview

### **🏪 Marketplace Page (`/marketplace`)**

- Asset discovery with search and filtering
- Investment statistics and analytics
- Asset cards with key metrics
- Direct investment flow

### **🏭 Tokenization Page (`/tokenize`)**

- 5-step asset tokenization wizard
- Document upload and verification
- Token economics configuration
- Compliance settings and deployment

### **💸 Transfer Page (`/transfer`)**

- Secure token transfer interface
- Address validation and compliance checking
- Transaction preview and confirmation
- Real-time balance updates

---

## 🔐 **Security & Compliance**

### **Wallet Security**

- Non-custodial wallet integration
- Private key remains with user
- Session management and auto-disconnect
- Network validation and switching

### **Transaction Safety**

- Multi-step validation process
- Compliance verification before transfers
- Clear transaction previews
- Comprehensive error handling

### **Regulatory Compliance**

- KYC verification requirements
- Jurisdiction-based restrictions
- Accredited investor validation
- Audit trail maintenance

---

## 📚 **Resources**

### **Documentation**

- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Wallet](https://freighter.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🧪 **Contract Testing**

All functions tested successfully on [Stellar Testnet](https://stellar.expert/explorer/testnet/contract/CBYQ6EVVIPTGRF6J565COVFI6HOEVBPZ7L5IWW47FLZMENXXA2D6P5DP).

### **Test Results**

✅ **18 operations tested** - mint, transfer, valuation updates, whitelist, pause/unpause  
✅ **Advanced features:** Dividend calculation, voting rights, transfer validation  
✅ **All 34 functions operational**

---
