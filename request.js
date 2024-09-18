const axios = require('axios');
const Big = require('big.js')

module.exports = {
  // 查mint进度
  async getMintStatus(txid){
    let {data} = await axios.get('https://explorer.unisat.io/fractal-mainnet/api/transaction/summary?txid='+txid)
    if(!data){
      return false;
    }
    try {
      let {data:{fullFlag}} = data
      return fullFlag
    } catch (error) {
      return false;
    }
  },
  // 查看地址余额
  async getFBBanlce(address){
    let {data} = await axios('https://explorer.unisat.io/fractal-mainnet/api/address/summary?address='+address);
    if(!data){
      return false;
    }
    let {data:{balance}} = data
    balance = (new Big(balance)).div(100000000)
    return balance.toString();
    // Big
  },
  // 查询当前gas
  async getGas(){
    let {data:{data:{halfHourFee}}} = await axios.get('https://explorer.unisat.io/fractal-mainnet/api/bitcoin-info/fee')
    return halfHourFee + 10;
  },

};