
let walletAddress = "";
const contractAddress = "0x6e9E4FBEeEd3DDb0B932a7dAc6A725e0497a63Ff";
const abi = [
    "function stake(uint256 amount) external",
    "function claim() external",
    "function withdraw() external",
    "function getStakedAmount(address user) external view returns (uint256)",
    "function getEarnedAmount(address user) external view returns (uint256)",
];

async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    walletAddress = await signer.getAddress();
    document.getElementById("walletAddress").textContent = walletAddress;
    const contract = new ethers.Contract(contractAddress, abi, signer);
    updateData(contract);
    setupButtons(contract);
}

async function updateData(contract) {
    const staked = await contract.getStakedAmount(walletAddress);
    const earned = await contract.getEarnedAmount(walletAddress);
    document.getElementById("stakedAmount").textContent = "Staked: " + ethers.utils.formatUnits(staked, 18);
    document.getElementById("earnedAmount").textContent = "Earned: " + ethers.utils.formatUnits(earned, 18) + " LYDIA";
}

function setupButtons(contract) {
    document.getElementById("stakeButton").onclick = async () => {
        const amount = document.getElementById("stakeInput").value;
        if (!amount) return alert("Enter amount");
        const value = ethers.utils.parseUnits(amount, 18);
        const tx = await contract.stake(value);
        await tx.wait();
        updateData(contract);
    };

    document.getElementById("claimButton").onclick = async () => {
        const tx = await contract.claim();
        await tx.wait();
        updateData(contract);
    };

    document.getElementById("withdrawButton").onclick = async () => {
        const tx = await contract.withdraw();
        await tx.wait();
        updateData(contract);
    };
}

document.getElementById("connectButton").onclick = connectWallet;
