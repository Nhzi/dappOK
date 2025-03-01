import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0xd5373B84B8FCF93EC621ff1C893c2ff1AEc8d343";
const contractABI = [
    "function setMessage(string memory newMessage) public",
    "function getMessage() public view returns (string memory)",
    "function sendMessage(bytes32 _encryptedMessage) public",
    "function getMessage(address _sender) public view returns (bytes32)"
];

export default function Home() {
    const [message, setMessage] = useState("");
    const [retrievedMessage, setRetrievedMessage] = useState("");
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
        }
    }, []);

    const connectWallet = async () => {
        if (!provider) return alert("Please install MetaMask");
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        const signer = provider.getSigner();
        setContract(new ethers.Contract(contractAddress, contractABI, signer));
    };

    const storeMessage = async () => {
        if (!contract) return alert("Connect your wallet first");
        const tx = await contract.setMessage(message);
        await tx.wait();
        alert("Message stored!");
    };

    const retrieveMessage = async () => {
        if (!contract) return alert("Yamete kudasai, GIve me wallet-kun!");
        const msg = await contract.getMessage();
        setRetrievedMessage(msg);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Web3 Messaging dApp</h1>
            {account ? (
                <p>Connected: {account}</p>
            ) : (
                <button onClick={connectWallet}>Connect Zha Wallet</button>
            )}
            <br />
            <input
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={storeMessage}>Store Message</button>
            <br />
            <button onClick={retrieveMessage}>Retrieve Message</button>
            {retrievedMessage && <p>Stored Message: {retrievedMessage}</p>}
        </div>
    );
}
