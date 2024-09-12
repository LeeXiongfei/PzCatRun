const cwdList = require('./cwdList.json')
const { spawn,exec } = require('child_process');
function cloneRepository(gitUrl, folderName) {
  return new Promise((resolve, reject) => {
    // 构建要执行的 git clone 命令
    const command = `git clone ${gitUrl} ${folderName}`;
    
    // 执行命令
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`克隆仓库时发生错误: ${stderr}`);
        reject(false); // 如果出错，返回 false
        return;
      }
      resolve(true); // 成功返回 true
    });
  });
}
async function installInit(cwd){
  const args = ['install'];
  const child = spawn('yarn', args, {cwd});
  return new Promise((resolve)=>{
    child.on('close', (code) => {
      resolve()
    });
  })
}
async function buildPro(cwd){
  const args = ['build'];
  const child = spawn('yarn', args, {cwd});
  return new Promise((resolve)=>{
    child.on('close', (code) => {
      resolve()
    });
  })
}
async function main(){
  // 下载代码
  for(let i = 1;i<11;i++){
    await cloneRepository('https://github.com/LeeXiongfei/PzCat.git','cat'+i);
  }
  
}
main()