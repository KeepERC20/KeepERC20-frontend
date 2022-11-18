/*
 * Declarations
 */
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";
import { TOKEN_CONTRACT_ADDR, KEEP_TOKEN_FACTORY_CONTRACT_ADDR, KEEP_TOKEN_CONTRACT_ADDR } from "./contract.js"
import { TOKEN_CONTRACT_ABI, KEEP_TOKEN_FACTORY_CONTRACT_ABI, KEEP_TOKEN_CONTRACT_ABI } from "./contract.js"
import { balanceOf_contract } from "./contract_request.js"

//const ETHERS_MAX = ethers.constants.MaxUint256;

const mumbaiTestChainId = '0x13881';
const mumbaiRPCUrl = 'https://polygon-testnet.public.blastapi.io';

let account = '';
let contract_erc = '';
let contract_factory = '';
let contract_keeperc = '';

/* 
 * Initialize functions
 */
async function connectContract() {
    console.log("connect to contract!");
    window.web3 = new Web3(window.ethereum);
    contract_erc = await new window.web3.eth.Contract(TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDR);
    contract_factory = await new window.web3.eth.Contract(KEEP_TOKEN_FACTORY_CONTRACT_ABI, KEEP_TOKEN_FACTORY_CONTRACT_ADDR);
    contract_keeperc = await new window.web3.eth.Contract(KEEP_TOKEN_CONTRACT_ABI, KEEP_TOKEN_CONTRACT_ADDR);
    console.log("connect to contract done.");
}

async function connectMetamask() {
    // metamask installed
    const provider = await detectEthereumProvider();
    if (provider) {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: mumbaiTestChainId }],
            });
            console.log("You have succefully switched to Mumbai Test network");

            // set global variables (contract, account)
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            return true;
        } catch (switchError) {
            console.log("Failed to switch to the network");

            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    console.log("This network is not available in your metamask, please add it");

                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: mumbaiTestChainId,
                                chainName: 'Mumbai',
                                rpcUrls: [mumbaiRPCUrl],
                                blockExplorerUrls: [],
                                nativeCurrency: {
                                    symbol: 'MATIC',
                                    decimals: 18
                                }
                            }
                        ]
                    });

                    // connect
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: mumbaiTestChainId }],
                    });
                    console.log("You have succefully switched to Mumbai Test network");

                    // set global variables (contract, account)
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    account = accounts[0];
                    return true;
                } catch (addError) {
                    console.log(addError);
                }
            }
        }
    } else {
        // If window.ethereum is not found then MetaMask is not installed
        alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    }
    return false;
}

async function addTokenToMetamask(tokenName) {
    const tokenContract = getContract(tokenName);
    const symbol = await tokenContract.methods.symbol().call();
    const decimals = await tokenContract.methods.decimals().call();
    const tokenImage = getContractImg(tokenName);

    const provider = window.ethereum;
    if (provider) {
        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await provider.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenContract._address,
                        symbol: symbol,
                        decimals: decimals,
                        image: tokenImage,
                    },
                },
            });
            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }
}

function getAccount() {
    return account;
}

function getContract(contractName) {
    if (contractName === "ERC") return contract_erc;
    else if (contractName === "KEEPERC") return contract_keeperc;
    else if (contractName === "FACTORY") return contract_factory;
}

function getContractImg(contractName) {
    // TODO
    if (contractName === "ERC") return '';
    else if (contractName === "KEEPERC") return '';
}

/* view functions */
async function getBalance(contractName) {
    let _contract = getContract(contractName);
    if (_contract === '' || getAccount() === '') return 0;
    let response = await balanceOf_contract(_contract, getAccount());
    return ethers.BigNumber.from(response);
}

export { connectContract, connectMetamask, addTokenToMetamask, getAccount, getBalance }