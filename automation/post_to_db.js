const { generateAEOPost } = require('./template_generator');

const API_URL = 'https://cryptoairdropai.com/api/add_post.php';
const API_SECRET = 'super_secret_automation_key_123'; // matches backend

async function postToDatabase(airdropData) {
  // 1. Format the data into AEO/GEO markdown + Omni Schema
  const markdownContent = generateAEOPost(airdropData);

  // 2. Prepare payload
  const payload = {
    api_key: API_SECRET,
    title: airdropData.title,
    slug: airdropData.slug,
    content: markdownContent,
    excerpt: airdropData.summary
  };

  console.log(`Sending payload for: ${payload.title}`);

  // 3. Post securely to our PHP endpoint
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    console.log('Server response:', result);
    return result;
  } catch (err) {
    console.error('Failed to post to database:', err);
  }
}

// Example Execution
const sampleAirdrop = {
  title: "Arbitrum Layer 3 Airdrop Guide",
  slug: "arbitrum-layer-3-airdrop-guide",
  summary: "Arbitrum is launching a new Layer 3 scaling solution and distributing 50 million ARB tokens to early testnet participants.",
  definition: "The Arbitrum Layer 3 Airdrop is a reward program designed to bootstrap liquidity and user adoption for Arbitrum's new highly scalable, application-specific chains built on top of Layer 2.",
  expertAuthor: {
    name: "Alex Sterling",
    role: "Senior Airdrop Analyst"
  },
  targetKeywords: ["Arbitrum L3 airdrop", "how to claim ARB", "crypto airdrop guide", "testnet rewards"],
  citations: [
    { title: "Arbitrum Foundation Official Docs", url: "https://docs.arbitrum.foundation/" },
    { title: "Layer 3 Technical Spec", url: "https://github.com/OffchainLabs/nitro" }
  ],
  steps: [
    { title: "Connect Wallet", action: "Go to the Arbitrum Testnet portal and connect your MetaMask." },
    { title: "Bridge ETH", action: "Bridge at least 0.01 Sepolia ETH to the new L3 network." },
    { title: "Swap Tokens", action: "Perform at least 5 swaps on the native testnet DEX." },
    { title: "Claim OAT", action: "Claim your Galxe OAT to secure your snapshot." }
  ],
  faqs: [
    { question: "What is the snapshot date for the Arbitrum L3 airdrop?", answer: "The exact snapshot date has not been officially announced, but historically snapshots occur approximately 4 weeks before token generation events." },
    { question: "Is there a minimum volume requirement?", answer: "Yes, early documentation suggests a minimum of $500 total volume bridged and swapped to qualify for the base tier." },
    { question: "Can I use multiple wallets?", answer: "Using multiple wallets (Sybil attacking) is heavily discouraged and projects use advanced clustering to exclude such wallets from rewards." },
    { question: "Do I need mainnet ETH for fees?", answer: "No, all early transactions happen on the Sepolia testnet environment, so you only need testnet ETH from a faucet." },
    { question: "When will the token launch happen?", answer: "The token generation event is expected in Q4 2026, following a 3-month testnet period." }
  ],
  date: new Date().toISOString()
};

postToDatabase(sampleAirdrop);
