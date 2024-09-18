


const {getAddress,createWallte,printTable,waitForEnter,mint} = require('./tool.js')
const cwdList = require('./cwdList.json')
const {getGas,getFBBanlce,getMintStatus} = require('./request.js')
const Big = require('big.js')
const { exec } = require('child_process');
const path = require('path');
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
  let {status,data,msg} = await mint(cwd);
  if(!status){
    return {status:0,msg}
  }
  console.log('正在minttxid:',data);
  while(true){
    let queue = [];
    for(let i =0;i<data.length;i++){
      let txid = data[i];
      
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
  return {status:1,msg:`txid:${data},mint完成`}
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
  let count = 0;
  while(true){
    count ++;
    // 查询当前地址gas是否充足
    let hasGas = await accountHasGas(address)
    if(!hasGas){
      return {address,mes:'gas不足',status:1};
    }
    let {msg,status} = await mintCat(cwd);
    if(count > 10 && !status){
      console.log(`${address}运行中触发中断,报错信息:${msg}`);
      return false;
    }
  }
};


async function deleteWallet(){
  return new Promise((resolve)=>{
    const scriptPath = path.join(__dirname, 'deleteWallet.sh');
    exec(`sh ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行脚本时出错: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`脚本错误输出: ${stderr}`);
        return;
      }
      console.log(stdout);
      resolve();
    });
  })
}
async function main(){
  while(true){
    let createWallteQueue = [];
    console.clear();
    // await deleteWallet()
    await waitForEnter('按回车开始工作.......')
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
    await Promise.all(mintQueue);
    await waitForEnter('所有地址mint完成,请查询确认后按回车开始下一轮......')
  }
}
main();