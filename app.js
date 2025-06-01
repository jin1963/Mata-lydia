
const connectButton = document.getElementById("connectButton");
const walletInfo = document.getElementById("walletInfo");
const walletAddressSpan = document.getElementById("walletAddress");
const stakedAmount = document.getElementById("stakedAmount");
const earned = document.getElementById("earned");

const stakeButton = document.getElementById("stakeButton");
const claimButton = document.getElementById("claimButton");
const withdrawButton = document.getElementById("withdrawButton");

let provider, signer, contract;

const CONTRACT_ADDRESS = "0x6e9E4FBEeEd3DDb0B932a7dAc6A725e0497a63Ff";
const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "stake",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];  // REPLACE with actual ABI or use ABI injection

connectButton.onclick = async () => {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        walletAddressSpan.innerText = address;
        walletInfo.style.display = "block";

        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        updateInfo(address);
    }
};

async function updateInfo(address) {
    const balance = await contract.balances(address);
    const reward = await contract.earned(address);
    stakedAmount.innerText = ethers.utils.formatUnits(balance, 18);
    earned.innerText = ethers.utils.formatUnits(reward, 18);
}

stakeButton.onclick = async () => {
    await contract.stake();
    const address = await signer.getAddress();
    updateInfo(address);
};

claimButton.onclick = async () => {
    await contract.claimReward();
    const address = await signer.getAddress();
    updateInfo(address);
};

withdrawButton.onclick = async () => {
    await contract.withdraw();
    const address = await signer.getAddress();
    updateInfo(address);
};
