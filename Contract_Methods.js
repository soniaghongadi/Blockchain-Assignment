const Web3 = require('web3')
var Tx = require('ethereumjs-tx').Transaction
var BigNumber = require('big-number')
const { promises } = require('dns')

//Infura ropesten account
const rpcURL = new Web3('https://ropsten.infura.io/v3/aafa65a2def14e1db4207ad6ee18d40f')

const web3 = new Web3(rpcURL)

//Metamask account address
const owner = '0x9b3f0b9B2FBfb867DdDEF3F2DbccF26c16106b48'

//Private key for metamask account 
const privateKey1 = Buffer.from('d9f027bdf75943ca48e8be27f133b37e592f8301c41520886dba5ab71ebb508a', 'hex')


//Read the deployed contract - get the addresss from Etherscan
const contractAddress = '0xceC7a9dDb9213A1FFCDe951f454b1bCF57a761C1'

//Published and verified ABI
const contractABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "_totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

const contract = new web3.eth.Contract(contractABI, contractAddress)

//get the transaction count
const getTransactionCount = async (account) => {
	return await web3.eth.getTransactionCount(account)
}

const sendTransaction = async (raw) => {
	return await web3.eth.sendSignedTransaction(raw)
}

//Transfer method
const transferFunds = async (owner, other_acc, amount) => {

	let txCount = await getTransactionCount(owner)

	console.log("Transaction count is returned: " + txCount)

	const txObject = {
		nonce: web3.utils.toHex(txCount),
		gasLimit: web3.utils.toHex(3000000),
		gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
		to: contractAddress,
		data: contract.methods.transfer(other_acc, amount).encodeABI()
	}

	const tx = new Tx(txObject, { chain: 'ropsten', hardfork: 'petersburg' })
	tx.sign(privateKey1)
	const serializedTx = tx.serialize()
	const raw = '0x' + serializedTx.toString('hex')

	console.log("About to send transaction")
	let minedTransaction = await sendTransaction(raw)
	console.log("Transaction hash returned: " + minedTransaction.transactionHash)
}

const getTotalSupply = async () => {
	let totSupply = await contract.methods.totalSupply().call()
	return "Total Supply is : " + totSupply
}
const getName = async () => {
	let name = await contract.methods.name().call()
	return "Owner Name is : " + name
}

const getSymbol = async () => {
	let symbol = await contract.methods.symbol().call()
	return "Symbol is : " + symbol
}

const getBalanceOf = async (owner) => {
	let balanceOf = await contract.methods.balanceOf(owner).call()
	return "Remaining balance is : " + balanceOf
}

const getDecimals = async () => {
	let decimals = await contract.methods.decimals().call()
	return "Decimal places per token is : " + decimals
}

//Read and display account.txt file where 10 accounts are added
let fs = require("fs")
let accounts = fs.readFileSync('AccountList.txt', 'utf8').split('\n');
for (looper = 0; looper < accounts.length; looper++) {
	console.log(`Account ${looper} is ${accounts[looper]}`)
}

//method to calculate 5% of remaining balance and distribute it to 10 accounts
const getremainingBalance = async () => {

	var remainingBalance = await getBalanceOf(owner)
	var bal = new BigNumber(remainingBalance)
	var distribute = bal.multiply(5).div(100).div(accounts.length + 1)
	console.log("Distributed value : " + (distribute.toString()))
	for (let index = 0; index < accounts.length; index++) {
		await transferFunds(owner, accounts[index], distribute)
		console.log("Tokens are received at : " + accounts[index]);
	}
	return true
}

//display name,symbol, total supply, decimal places, balance of owner and distribution 
const printvalues = async () => {

	console.log(await getTotalSupply())
	console.log(await getName())
	console.log(await getDecimals())
	console.log(await getSymbol())
	console.log(await getBalanceOf(owner))
	console.log(await getremainingBalance())
}

printvalues()


