//* Importing necessary modules from the ethers.js library
import { ethers } from "ethers";
//* Importing the ABI (Application Binary Interface) of the contract
import ctAbi from "@/json/todo.json";

//* Declaring a variable to hold the Ethereum object from the window
let ethereum: any;
if (typeof window !== "undefined") ethereum = (window as any).ethereum;

//* Defining constants for the contract ABI and the contract address
const CONTRACT_ABI = ctAbi.abi;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

//* Function to get the required signer (either from MetaMask or a random wallet)
export const getRequiredSigner = async () => {
  //* Check if MetaMask is installed
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  //* Check if the ethereum object supports the request method
  if (typeof ethereum.request !== "function") {
    throw new Error("MetaMask does not support ethereum.request method");
  }

  try {
    //* Request the list of accounts from MetaMask
    const accounts = await ethereum.request({ method: "eth_accounts" });

    let provider;
    let signer;

    //* If accounts are available in MetaMask
    if (accounts?.length > 0) {
      //* Create a provider from MetaMask's ethereum object
      provider = new ethers.BrowserProvider(ethereum);
      //* Get the signer from the provider
      signer = await provider.getSigner();
      return signer;
    } else {
      //* If no accounts are available, create a provider using a fallback RPC URL
      provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      //* Create a random wallet
      const wallet = ethers.Wallet.createRandom();
      //* Connect the wallet to the provider
      signer = wallet.connect(provider);
      return signer;
    }
  } catch (error) {
    console.error("Error getting SIGNER:", error);
    throw new Error("Failed to get SIGNER");
  }
};

//* Function to get the contract instance
export const getTaskContract = async () => {
  //* Check if MetaMask is installed
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    //* Get the required signer
    const signer = await getRequiredSigner();

    //* Create a contract instance with the contract address, ABI, and signer
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    return contract;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};
