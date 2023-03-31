import { ethers } from "ethers";
import { TOKEN_CONTRACT_ADDR, KEEP_TOKEN_FACTORY_CONTRACT_ADDR, KEEP_TOKEN_CONTRACT_ADDR } from "./contract.js"
import { TOKEN_CONTRACT_ABI, KEEP_TOKEN_FACTORY_CONTRACT_ABI, KEEP_TOKEN_CONTRACT_ABI } from "./contract.js"
import { mint_contract, createWallet_contract, approve_contract, queueScheduledTransferWithExtra_contract, queueRecoverableTransferWithExtra_contract, queueExpirableApprove_contract } from "./contract_request.js"
import { balanceOf_contract, walletOf_contract, allowance_contract, activeTasksOf_contract, tasks_contract } from "./contract_request.js"

// const ETHERS_MAX = ethers.constants.MaxUint256;

const mumbaiTestChainId = '0x13881';
const mumbaiRPCUrl = 'https://rpc.ankr.com/polygon_mumbai';
const provider = new ethers.providers.JsonRpcProvider(mumbaiRPCUrl); // TODO: selection

let accounts = [];
let currentAccount = undefined; // global, current
let currentAddress = ''; // global, current

let contract_erc = '';
let contract_factory = '';
let contract_keeperc = '';

// load from chrome extension local storage
async function loadAccounts() {
    const result = await chrome.storage.local.get(['accounts']);
    accounts = result.accounts || [];
    console.log('Account list loaded from local storage:', accounts);
    return accounts
}

// TODO: redundancy check
async function createNewAccount() {
    const newWallet = ethers.Wallet.createRandom();
    const newAccount = {
        address: newWallet.address,
        privateKey: newWallet.privateKey
    };

    accounts.push(newAccount);
    await chrome.storage.local.set({ accounts: accounts }, function () {
        console.log('Accounts saved to local storage', accounts);
    });

    return newAccount;
}

// TODO: redundancy check
async function importNewAccount(privateKey) {
    const newWallet = new ethers.Wallet(privateKey, provider);
    const newAccount = {
        address: newWallet.address,
        privateKey: newWallet.privateKey
    };

    accounts.push(newAccount);
    await chrome.storage.local.set({ accounts: accounts }, function () {
        console.log('Accounts saved to local storage', accounts);
    });

    return newAccount;
}

async function setCurrentWallet(privateKey) {
    currentAccount = new ethers.Wallet(privateKey, provider);
    currentAddress = currentAccount.address;
    return true;
}

async function connectContract() {
    contract_erc = new ethers.Contract(TOKEN_CONTRACT_ADDR, TOKEN_CONTRACT_ABI, provider);
    contract_factory = new ethers.Contract(KEEP_TOKEN_FACTORY_CONTRACT_ADDR, KEEP_TOKEN_FACTORY_CONTRACT_ABI, provider);
    contract_keeperc = new ethers.Contract(KEEP_TOKEN_CONTRACT_ADDR, KEEP_TOKEN_CONTRACT_ABI, provider);
}

//////

function getAddress() {
    return currentAddress;
}

function getAccount() {
    return currentAccount;
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

function getStringFromTypes(nTypes) {
    if (nTypes === '0') return "Scheduled Transfer";
    if (nTypes === '1') return "Recoverable Transfer";
    if (nTypes === '2') return "Expirable Approve";
    return "Unknown";
}

function getStringFromStatus(bActive) {
    if (bActive === false) return "Executed";
    if (bActive === true) return "Pending";
    return "Unknown";
}

/* send functions */
async function faucet() {
    let _contract = getContract("ERC");
    if (_contract === '' || getAddress() === '') return 0;
    let response = await mint_contract(_contract, getAccount(), ethers.utils.parseUnits("100", "ether"));
    return response;
}

async function createWallet() {
    let _contract = getContract("KEEPERC");
    if (_contract === '' || getAddress() === '') return 0;
    let response = await createWallet_contract(_contract, getAccount());
    return response;
}

async function submit(_erc20, _from, _to, _value, _extra, _blocks, _function) {
    let _contract = getContract("KEEPERC");
    if (_contract === '' || getAddress() === '') return 0;

    let response;
    // console.log(_erc20, _from, _to, _value, _extra, _blocks, _function)
    if (_function === 'S') response = await queueScheduledTransferWithExtra_contract(_contract, getAccount(), _to, _value, _extra, _blocks);
    else if (_function === 'R') response = await queueRecoverableTransferWithExtra_contract(_contract, getAccount(), _to, _value, _extra, _blocks);
    else if (_function === 'E') response = await queueExpirableApprove_contract(_contract, getAccount(), _to, _value, _blocks);
    //else response = await queueScheduledTransferWithExtra_contract(_contract, _from, _to, _value, _extra, _blocks);
    return response;
}

async function approveMax(contractName) {
    let _contract = getContract(contractName);
    if (_contract === '' || getAddress() === '') return 0;
    let response = await approve_contract(_contract, getAccount(), KEEP_TOKEN_CONTRACT_ADDR, ethers.constants.MaxUint256);
    return response;
}

/* view functions */

async function getETHBalance() {
    const response = await provider.getBalance(getAddress());
    return ethers.BigNumber.from(response);
}

async function getBalance(contractName) {
    let _contract = getContract(contractName);
    if (_contract === '' || getAddress() === '') return 0;
    let response = await balanceOf_contract(_contract, getAddress());
    return ethers.BigNumber.from(response);
}

async function getWalletAddress() {
    let _contract = getContract("KEEPERC");
    if (_contract === '' || getAddress() === '') return 0;
    let response = await walletOf_contract(_contract, getAddress());
    return response; // address
}

async function getAllowance(contractName) {
    let _contract = getContract(contractName);
    if (_contract === '' || getAddress() === '') return 0;
    let response = await allowance_contract(_contract, getAddress(), KEEP_TOKEN_CONTRACT_ADDR);
    return ethers.BigNumber.from(response);
}

async function getActiveTasks() {
    let _contract = getContract("KEEPERC");
    if (_contract === '' || getAddress() === '') return 0;
    let response = await activeTasksOf_contract(_contract, getAddress());
    // console.log("List of task id.", response);
    return response; // list of task id
}

async function getTask(_tid) {
    let _contract = getContract("KEEPERC");
    if (_contract === '') return 0;
    let response = await tasks_contract(_contract, _tid);
    //console.log("Got task object.", response);
    return response; // task object
}

export { faucet, createWallet, submit, approveMax };
export { loadAccounts, connectContract, setCurrentWallet, createNewAccount, importNewAccount, getAddress, getStringFromTypes, getStringFromStatus, getETHBalance, getBalance, getWalletAddress, getAllowance, getActiveTasks, getTask };