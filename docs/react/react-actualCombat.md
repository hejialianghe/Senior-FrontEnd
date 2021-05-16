## 7.1 TypeScripts实战上

在编程语言中如果按类型检测划分，可以分为2大类，一类是静态类型和一类是动态类型；我们所了解的java、c、c++等后端语言都是静态类型，而javascript属于动态类型；由于静态类型已经被证明符合管理复杂的应用，所以我们要学一下typescript是有必要的。

### 7.1.1 TypeScript 设计原则

- 静态识别可能出现错误的代码结构。
- 为大型应用的代码提供结构化的机制。
- 不增加程序运行时开销，保留javascript运行时行为这一特性。
- 语言层面提供可组合性、可推理性。
- 语法层面保持和ECMAScript提案一致。
- 不增家额外的表达示层面的语法。

### 7.1.2 TypeScript 基础

#### ts的特点

1. 跨平台，mac和window都支持。

2. 静态类型检测。

3. 可选的类型检测。

4. 面向对象

5. ES6特性的支持

6. 对DOM的支持

#### 变量声明

```ts
    // sting类型
    const name:string=''
    // number类型
    const money:number=100
    // boolean类型
    const boolShow:boolean=true
    // 定义数组类型
     const list:number[]=[1,2,3]
     const list2:Array<number>=[1,2,3]
    //  定义元组类型
    const tuple:[number,string]=[1,'nice']
    // 枚举 Monday默认值0，剩下的依次递增
    enum DateEnum {
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday
    }
    const date:DateEnum=DateEnum.Monday
    // void 表示无返回值
    const setValue:()=>void=()=>{
        
    }
    function otherSetValue():void{

    }
    const simpvalue:any=2
```
#### 变量的基本类型

| 类型名称  |  表示式  | 
| :--------: | :------: | 
|  布尔值  | boolean |  
| 数字  | number |  
| 字符串  | string | 
| 数组  | number[] 或 Array<number\> |  
| 元组  | [number,string] | 
| 枚举  | enum |
| Any  | any | 
| Void  | void | 
| Null  | null | 
| Undefined  | undefined | 
| Never  | never | 

Never永远不存在，或者不是我们想要的，用在抛出异常的函数里；never用try catch的catch

#### 接口

标准类型-interface

在面向对象语言中，接口（interface)是一个很重要的概念，它是对行为的抽象，而具体如何行动需要有类（class）去实现。

TypeScript中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「Shape」进行描述。

```ts
// 首字母大写
    interface Iprops {
        name:string,
        gender:number,
        address:string
    }
    const staff:Iprops={
        name:'zk',
        gender:1,
        address:'suzhou' 
    }
    function register ():Iprops{
        return {
            name:'zk',
            gender:1,
            address:'suzhou' 
        }
    }
```

#### 类型别名-type

- 类型别名用来给一个类型起一个新名字
- 字符串字面量类型用来约束取值只能是某几个字符串中的一个
- type可以扩展，但是不能继承

```ts
// 首字母大写
    type Iprops ={
        name:string,
        gender:number,
        address:string
    }
    const staff:Iprops={
        name:'zk',
        gender:1,
        address:'suzhou' 
    }
    function register ():Iprops{
        return {
            name:'zk',
            gender:1,
            address:'suzhou' 
        }
    }
```

#### 接口VS类型别名

接口

- 可以继承，可以多态。接口的实现需要implements

- 既是“抽象”也是“约束”

- 优先使用

类型别名

- 只是类型的别名，没有创建新类型。扩展可以使用&实现

- 主要是约束作用，早期TypeScript主要用作函数、对象的约束

#### 类型断言

- typeScript 允许你覆盖它的推断，并且能以你任何你想要的方式分析它，这种机制被称为类型断言

- 通常用来手动指定一个值的类型

- JSX不能使用`<>`


```ts
// 语法
值 as 类型
   or
<类型>值
interface Hello {
    sayHello:()=>void,
    name:string
}
const a={} 
a.name ='zs' // 没有定义类型，会提示类型“{}”上不存在属性“name”

// 用类型断言指定类型
const a ={} as Hello
  or
const a=<Hello>{}

```
类型断言是欺骗类型检测，所以最好在确定类型的情况下去用。

#### 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```ts
// 泛型接口
interface IGprops {
    setName:<T>(str:T)=>void
}
const nameWrapper:IGprops={
    setName:<T>(str:T)=>{
        const userNameArr2:T[]=[]
        userNameArr2.push(str)
    }
}

nameWrapper.setName('zs')
nameWrapper.setName(123)
```
## 7.2 TypeScripts实战下

### 7.2.1 TypeScript & React实践

#### tsconfig.json

```ts
{
  "compilerOptions": {
    "target": "ESNext", // 指定ECMA的版本，这里我们指定了最新版本
    "module": "ESNext", // 代码组织方式
    "lib": [ //工程中依赖的配置
      "DOM",
      "DOM.Iterable",
      "ESNext"
    ],
    "moduleResolution": "node", 
    "experimentalDecorators": true, // 是否开启装饰器
    "allowSyntheticDefaultImports": true,
    "outDir": "dist", //输出目录
    "strictNullChecks": true, // 对null严格检测
    "sourceMap": true, //开启开发者调试
    "baseUrl": ".",
    "rootDir": ".",
    "jsx": "react",
    "allowJs": true, // 所有的js都需要编译
    "resolveJsonModule": // true,是否用json文件
    "typeRoots": [ // 第三方包和自己包的类型声明
      "node_modules/@types",
      "src/types"
    ],
    "paths": { // alias配置
      "@/*": ["./src/*"],
    }
  },
  "exclude": [
    "node_modules",
    "dist"
  ],
  "compileOnSave": false //是否在保存的时候进行编译
}
```

### 7.2.2 扩展学习

[ts官方文档（最新文档）](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

[中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)

[入门教程](https://ts.xcatliu.com/)

[更好的理解 TS 泛型](https://medium.com/@rossbulat/typescript-generics-explained-15c6493b510f)

## 7.3 React 组件性能优化

### 7.3.1 React 组件性能探寻

#### React Devtools （react中的性能分析工具）推荐

- React v16.5.0+（开发模式）
- React Developer Tools V3.3.2+

追踪用户行为

1. 安装schedule包， yarn add schedule

2. 在需要追踪的地方嵌入代码

```jsx
import { unstable_track as track} from 'schedule/track'

export default class Home extends Component {
    handleSubmit =e=>{
        const text = e.target.value.trim()
        // 用户点击了回车按钮就进行追踪
        if(e.which===13){
            track("Add TOdo",performance,now,()=>{
                this.props.onSave(text)
                if(this.props.newTodo){
                    this.setState({text:''})
                }
            })
        }
    }
}

```
#### React Profiler API（react中的性能分析工具）

1. Profilter在“react”包中。
2. onRender回调函数，返回一系列信息。

### 7.3.2 组件性能优化

#### PureComponent

- class 组件优化工具

- 实质是shouldComponentUpdate 方法中进行浅比较

父组件
```js
import React  from 'react';

export default class extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date : new Date(),
            id:1
        }
    }
    componentDidMount(){
        setInterval(()=>{
            this.setState({
                date:new Date()
            })
        },1000)
    }
    render(){
        return (
            <div>
                <Child seconds={id}/>
                <div>{this.state.date.toString()}</div>
            </div>
        )
    }
```
从上面可以看出`date`变量的变化，整个组件都需要diff，我们看出child组件并不依赖`date`变量；所以date变化的时候，子组件完全没不要渲染，那么我们可以用`PureComponent`优化一下。

```js
class Child extends React.PureComponent {
    render(){
        return (
            <div>{this.props.seconds}</div>
        )
    }
}
```

#### memo 

- 函数组件优化工具

- 是一个高阶函数，在其内部进行类似shouldComponentUpdate的比较

- 可以指定比较函数

```js
function Child({seconds}){
    return (
        <div>I am update every {seconds} seconds</div>
    )
};
export default React.memo(Child)
```
::: warning
React.memo()可接受2个参数，第一个参数为纯函数的组件，第二个参数用于对比props控制是否刷新，与shouldComponentUpdate()功能类似。[2]

 React.memo 等效于 PureComponent，但它只比较 props。（你也可以通过第二个参数指定一个自定义的比较函数来比较新旧 props。如果函数返回 true，就会跳过更新。）
:::

```js
function Child({seconds}){
    return (
        <div>I am update every {seconds} seconds</div>
    )
};

function areEqual(prevProps, nextProps) {
    if(prevProps.seconds===nextProps.seconds){
        return true
    }else {
        return false
    }

}
export default React.memo(Child)
```
#### 原生事件、定时器的销毁

![](~@/react/reactNature.png)

#### Web Workers API 尝试

- Web Workers 使用后，Web应用程序可以：
 - 在独立于主线程的后台线程中运行一个脚本；
 - 在独立线程中执行费时的处理人物，避免一些耗时的任务阻断用户体验

- 通信机制 Web Worker执行完耗时任务后与主线程的通信--postMessage

### 7.3.3 扩展资料

[React Profiler 博客](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

[理解火焰图](http://www.brendangregg.com/flamegraphs.html)

[React Profiler API](https://reactjs.org/docs/profiler.html#gatsby-focus-wrapper)

[React 优化手段](https://www.codementor.io/blog/react-optimization-5wiwjnf9hj)

