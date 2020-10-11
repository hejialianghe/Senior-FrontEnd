#!/usr/bin/env node
const program=require('commander')


program
     .name('better-clone')// cli 的名字
     .version('0.0.1') // 版本
     .option('-v,--verbose','verposity that can be increased') // -v 简写 --verbose全称 后面是描述

// 给program添加子命令，可以用command这个方法
program
   .command('clone <source> [destination]') // clone 是子命令，source是必填参数，destination 是选填参数
   .option('-d,--depths <level>','git clone depths') 
   .description('cloe a repository into a newly created directory')
   .action((source,destination,cmdObj)=>{ // cmdObj存放所有option的键值对
        console.log(`start cloning from ${source} to ${destination} with depth ${cmdObj.depths}`);
   })

program.parse(process.argv) // 从process.argv中取得命令行参数