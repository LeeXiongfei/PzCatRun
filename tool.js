const {matchAddress,matchMnemonic} = require('./match')
const { spawn } = require('child_process');
const readline = require('readline');
const {getGas} = require('./request')
const {matchAllTxid} = require('./match.js')
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
    const args = ['cli', 'mint', '-i', '45ee725c2c5993b3e4d308842d87e973bf1951f5f7a804b21e4dd964ecd12d6b_0', '5', '--fee-rate', gas];
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