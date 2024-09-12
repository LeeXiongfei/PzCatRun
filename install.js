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
      
      console.log(`仓库克隆成功: ${stdout}`);
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
  let instalQueue = [];
  for(let i = 0;i<cwdList.length;i++){
    let cwd = cwdList[i];
    instalQueue.push(installInit(cwd))
  }
  await Promise.all(instalQueue)
  console.log('依赖安装完成');
  let buildQueue = [];
  for(let i = 0;i<cwdList.length;i++){
    let cwd = cwdList[i];
    buildQueue.push(buildPro(cwd))
  }
  await Promise.all(buildQueue)
  console.log('安装完成');
  
}
main()