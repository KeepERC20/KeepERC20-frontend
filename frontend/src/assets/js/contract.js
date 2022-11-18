import TOKEN from './json/ERC20.json'
import KEEP_TOKEN_FACTORY from './json/KeepERC20Factory.json'
import KEEP_TOKEN from './json/KeepERC20.json'
import address from './json/address.json'

const TOKEN_CONTRACT_ADDR = address.Token;
const KEEP_TOKEN_FACTORY_CONTRACT_ADDR = address.KeepTokenFactory;
const KEEP_TOKEN_CONTRACT_ADDR = address.KeepToken;

const TOKEN_CONTRACT_ABI = TOKEN.abi;
const KEEP_TOKEN_FACTORY_CONTRACT_ABI = KEEP_TOKEN_FACTORY.abi;
const KEEP_TOKEN_CONTRACT_ABI = KEEP_TOKEN.abi;

export { TOKEN_CONTRACT_ADDR, KEEP_TOKEN_FACTORY_CONTRACT_ADDR, KEEP_TOKEN_CONTRACT_ADDR };
export { TOKEN_CONTRACT_ABI, KEEP_TOKEN_FACTORY_CONTRACT_ABI, KEEP_TOKEN_CONTRACT_ABI };