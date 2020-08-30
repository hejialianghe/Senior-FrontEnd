
const path =require('path')
const fs = require('fs')
const vm=require('vm')


// 加载模块
function tryModuleLoad(module){
    // 获取path扩展名
    let ext=path.extname(module.id)
    Module.extensions[ext](module)
}

// Module处理文件加载的过程
function Module (id) {
    this.id=id
    this.exports={}
}
Module._cache={}
Module.extensions = {}

// 解析用户传进去的路径，获取一个绝对路径
Module._resolveFilename=function (id){
// 转换成绝对路径
 const adsPath= path.resolve(id)
//  如果已经有后缀了，直接返回
 if(fs.existsSync(adsPath)){
    return adsPath
}
//  添加后缀
    const extenisons=Object.keys(Module.extensions)
    for (let item of extenisons){
        // 判断是否有这个文件
        let currentPath=adsPath+item
        console.log('adsPath',currentPath);
        if(fs.existsSync(adsPath+item)){
            return currentPath
        }
    }
    // 如果上面都不符合，说明没有这个文件，就抛出错误
    throw new Error('文件不存在')
}

Module.extensions['.js']=function (module){

  let sctipt =fs.readFileSync(module.id,'utf8')

  let content ='(function (module) {'+sctipt+'})'

    // 创建沙箱环境，返回js函数
  let fn=vm.runInThisContext(content)

  console.log('content-----------',sctipt,fn);
//   执行返回的js函数，把module传进去，为了让我们的模块在module.exports上添加变量或函数或对象
  fn.call(module.exports, module)
}

Module.extensions['.json']=function (module){
    let script = fs.readFileSync(module.id, 'utf8');    
    module.exports = JSON.parse(script)
}

// id是要加载的文件路径
function myrequire (id){
    // 获取绝对路径
    let fileName=Module._resolveFilename(id)
    console.log('fileNmme',fileName);
    let cache=Module._cache[fileName]
    if(cache){
        return cache.exports
    }
    // 获得导出的模块对象{id:'',exports:''}
    let module=new Module(fileName)
    Module._cache[fileName]=module
    // 加载模块，就是给这个模块的exports赋值
    tryModuleLoad(module)
    return module.exports
}

let str=myrequire('./add')
console.log('str',str());