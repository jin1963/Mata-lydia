
let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        document.getElementById("wallet").innerText = await signer.getAddress();
        contract = new ethers.Contract(contractAddress, abi, signer);
    }
}

async function stake() {
    const amount = document.getElementById("amount").value;
    if (contract && amount > 0) {
        await contract.stake(ethers.utils.parseUnits(amount, 18));
    }
}

async function claimReward() {
    if (contract) {
        await contract.claimReward();
    }
}

async function withdraw() {
    if (contract) {
        await contract.withdraw();
    }
}
