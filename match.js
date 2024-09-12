module.exports = {
  matchAddress(input) {
    const regex = /Your address is\s*([a-zA-Z0-9]+)/;
    const match = input.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return null;
    }
  },
  matchMnemonic(input) {
    input = input.split('\n')
    const regex = /Your wallet mnemonic is:\s*([a-z\s]+)/i;
    for(let i = 0;i<input.length;i++){
      let text = input[i];
      const match = text.match(regex);
      // 如果找到了助记词，返回它，否则返回 null
      if (match && match[1]) {
        const mnemonic = match[1].trim();
        return mnemonic;
      }
    }
    return null;
  }
  ,
  // 匹配txid
  matchAllTxid(input) {
    // 定义正则表达式来匹配 'txid: ' 后面的内容
    const regex = /txid:\s*([a-f0-9]+)/g;
    
    // 使用正则表达式找到所有匹配项
    const matches = [...input.matchAll(regex)];
    
    // 如果有匹配的 txid，返回所有匹配的 txid，否则返回 false
    if (matches.length > 0) {
      return matches.map(match => match[1]);  // 提取每个匹配项中的 txid
    } else {
      return false;
    }
  }
}