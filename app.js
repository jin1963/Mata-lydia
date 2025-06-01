const contractAddress = "0x6e9E4FBEeEd3DDb0B932a7dAc6A725e0497a63Ff";
const abi = [ // Simplified ABI for core functions
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getStakedAmount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getEarnedReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

let web3, contract, user;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    document.getElementById('walletAddress').textContent = user.slice(0, 6) + '...' + user.slice(-4);
    contract = new web3.eth.Contract(abi, contractAddress);
    updateData();
  } else {
    alert('Please install MetaMask!');
  }
}

async function updateData() {
  const staked = await contract.methods.getStakedAmount(user).call();
  const earned = await contract.methods.getEarnedReward(user).call();
  document.getElementById('stakedAmount').textContent = web3.utils.fromWei(staked);
  document.getElementById('earnedAmount').textContent = web3.utils.fromWei(earned) + ' LYDIA';
}

async function stake() {
  const amount = document.getElementById('stakeInput').value;
  if (!amount) return alert("Enter amount");
  const wei = web3.utils.toWei(amount);
  await contract.methods.stake(wei).send({ from: user });
  updateData();
}

async function claimRewards() {
  await contract.methods.claimRewards().send({ from: user });
  updateData();
}

async function withdraw() {
  await contract.methods.withdraw().send({ from: user });
  updateData();
}

document.getElementById('connectWallet').onclick = connectWallet;
document.getElementById('stakeButton').onclick = stake;
document.getElementById('claimButton').onclick = claimRewards;
document.getElementById('withdrawButton').onclick = withdraw;
