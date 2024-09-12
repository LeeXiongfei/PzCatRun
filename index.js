


const {getAddress,createWallte,printTable,waitForEnter,mint} = require('./tool.js')
const cwdList = require('./cwdList.json')
const {getGas,getFBBanlce} = require('./request.js')
const Big = require('../../node_modules/big.js')
// 计算当前账户是否有接下来mint的gas
async function accountHasGas(address){
  let gas = await getGas();
  gas = (new Big(gas)).times(0.000039);
  let balance = await getFBBanlce(address);
  let diffGas =  (new Big(balance)).minus(gas);
  diffGas = diffGas.toString()
  return diffGas > 0.01;
}
function sleep(){
  return new Promise((resolve)=>{
    setTimeout(resolve, 1*1000);
  })
}


async function mintCat(cwd){
  // 获取地址
  let result = await mint(cwd);
  if(!result){
    console.log('失败');
    return
  }
  console.log('txid',result);
  
  while(true){
    let queue = [];
    for(let i =0;i<result.length;i++){
      let txid = result[i]
      let status =  getMintStatus(txid);
      queue.push(status)
    }
    let status = await Promise.all(queue);
    let count = status.filter(tx=>tx).length;
    
    if(count == queue.length){
      break;
    }
    await sleep();
  }
  let balance = await getFBBanlce('bc1pftj2apmhrxkhdrw4804v0cayphmlxvx6ww3tzxrc6zqwfzlurwvqucw3jz');
}


async function initWallet(cwd){
  let mnemonic = await createWallte(cwd);
  let address = await getAddress(cwd);
  return {
    cwd,
    data:{mnemonic,address}
  }
}
async function startMint(cwd,address){
  while(true){
    // 查询当前地址gas是否充足
    let hasGas = await accountHasGas(address)
    if(!hasGas){
      return true;
    }
    await mintCat(cwd);
  }
};

async function main(){
  while(true){
    let step;
    let createWallteQueue = [];
    // 创建钱包
    for(let i = 0;i<cwdList.length;i++){
      let cwd = cwdList[i];
      createWallteQueue.push(initWallet(cwd));
    };
    let walletQueue  = await Promise.all(createWallteQueue);
    printTable(walletQueue.map(({data})=>data));
    await waitForEnter('充值完成后按回车继续.......')
    let mintQueue = [];
    for(let i = 0;i<walletQueue.length;i++){
      let {cwd,data:{address}} = walletQueue[i];
      mintQueue.push(startMint(cwd,address))
    };
    await Promise.all(mintQueue)
  }
}
// main();


