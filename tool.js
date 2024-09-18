const {matchAddress,matchMnemonic} = require('./match')
const { spawn } = require('child_process');
const readline = require('readline');
const {getGas} = require('./request')
const {matchAllTxid} = require('./match.js')
const Big = require('big.js')
// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 等待用户输入回车的函数
function waitForEnter(msg) {
  return new Promise((resolve) => {
    rl.question(msg, () => {
      resolve();
    });
  });
}
module.exports = {
  waitForEnter,
  async getAddress(cwd){
    const command = 'yarn';
    const args = ['cli', 'wallet', 'address'];
    const child = spawn(command, args, {cwd});
    return new Promise((resolve)=>{
      let output = '';
      child.stdout.on('data', (data) => {
        output += data;
      });
      child.on('close', (code) => {
        let address = matchAddress(output)
        resolve(address)
      });
    })
  },
  async createWallte(cwd){
    const command = 'yarn';
    const args = ['cli', 'wallet', 'create'];
    const child = spawn(command, args, {cwd});
    return new Promise((resolve)=>{
      let output = '';
      child.stdout.on('data', (data) => {
        output += data;
      });
      child.on('close', (code) => {
        let Mne = matchMnemonic(output)
        resolve(Mne)
      });
    })
  },
  // 发起mint
  async mint(cwd){
    const command = 'yarn';
    let gas = await getGas();
    let gasToU = (new Big(gas)).times(0.000039) ;
    if(gasToU > 3){
      return false
    }
    const args = ['cli', 'mint', '-i', 'cc1b4c7e844c8a7163e0fccb79a9ade20b0793a2e86647825b7c05e8002b9f6a_0', '20', '--fee-rate', gas];
    const child = spawn(command, args, {cwd});
    return new Promise((resolve)=>{
      let output = '';
      child.stdout.on('data', (data) => {
        output += data;
      });
      child.on('close', (code) => {
        let txid = matchAllTxid(output);
        resolve(txid)
      });
    })
  },
  printTable(data) {
    if (!Array.isArray(data) || data.length === 0) {
      console.log('无数据');
      return;
    }
    console.log('请为相应的地址充值,并保存相应助记词');
    console.table(data, ['mnemonic', 'address']);
  }
}