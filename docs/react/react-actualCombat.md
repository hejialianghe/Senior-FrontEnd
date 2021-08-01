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

## 7.3 React 性能优化

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

#### 1. PureComponent

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

#### 2. memo 

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
不要以为子组件用React.memo就万事大吉了

```js
function Father({seconds}){
    /*
     我们向子组件传递函数，但是函数组件里的函数在每次更新的情况下，函数是重新创建的
     那么子组件每次发现传递函数变化了，也会进行更新，那么你用React.memo进行优化就没有作用了
     怎么解决呢？可以用useCallback进行包裹
    */

    //优化前
    function change() {}

    // 优化后
    const change  = useCallback(()=>{

    },[])
    return (
        <Child change={change}></Child>
    )
};

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
export default React.memo(Child,areEqual)
```
#### 3 原生事件、定时器的销毁

![](~@/react/reactNature.png)

#### 4.使用不变的数据结构

数据不变性不是架构或设计模式，而是一种固执己见的代码编写方式。这迫使您考虑如何组织应用程序数据流。在我看来，数据不变性是围绕严格的单向数据流进行的实践。

优势：
 - 零副作用
 - 不可变数据对象更易于创建、测试和使用
 - 容易跟踪变化

案例：

```js
class Imu extends Component { 

    state = {
       users: []
   }

   addNewUser = () =>{
       const users = this.state.users;
       users.push({
           userName: "robin",
           email: "email@email.com"
       });
       this.setState({users: users});
   }
}
```
上面这种情况，user和this.state.users是同一个引用，我们直接修改user，相当于直接修改了this.state.users；react状态应该是不可变的,因为setState()之后，能替换调你在之前所做的修改

直接修改state带来的问题：

我们利用shouldComponentUpdate来判断是否重新渲染组件，this.state.users和nextState.user是同一个引用，所以即使数组变化了,React也不会重新渲染UI

```js
 shouldComponentUpdate(nextProps, nextState) {
    if (this.state.users !== nextState.users) {
      return true;
    }
    return false;
  }
```
如何避免此类问题

```js
  addNewUser = () => {
       this.setState(state => ({
         users: state.users.concat({
           timeStamp: new Date(),
           userName: "robin",
           email: "email@email.com"
         })
       }));
   };
```
可以考虑以下不可变的方法：

数组：[].concat 或 [...params]

对象：Object.assign({}, ...)或 es6{...params}

可变数据结构的优化库:

1. mmutable.js

2. react-copy-write

#### 5. 拆分文件

随着不断的添加新功能和依赖项，不只不觉你的项目变的巨大，我们可以考虑分离第三方包；把您的应用程序代码和第三方库分离，
通过拆分文件，您的浏览器可以并行下载资源，减少等待时间，[SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)

#### 6. 依赖优化

在优化应用程序代码的时候，有必要检查你在程序中使用了多少库的代码，例如你使用了Moment.js;这个库包含了许多你不需要的国家化语言包，那么您可以考虑使用moment-locales-webpack-plugin为您的最终包删除未使用的语言包。

lodash，你可以用lodash-webpack-plugin删除未使用的功能

#### 7. React.Fragments 用于避免多余HTML元素

在react中我们必须用一个根元素包裹子元素，我们可以用React.Fragment进行包裹，在渲染的时候它并不会渲染成真的HTML元素

```js
class Comments extends React.PureComponent{
    render() {
        return (
            <React.Fragment>
                <h1>Comment Title</h1>
                <p>comments</p>
                <p>comment time</p>
            </React.Fragment>
        );
    } 
}

// or

class Comments extends React.PureComponent{
    render() {
        return (
            <>
                <h1>Comment Title</h1>
                <p>comments</p>
                <p>comment time</p>
            </>
        );
    } 
}
```
#### 8. 避免在渲染函数中使用内联函数定义

由于函数是 JavaScript ( {} !== {})中的对象，因此当 React 进行 diff 检查时，内联函数将始终diff失败。此外，如果在 JSX 属性中使用箭头函数，则会在每个渲染上创建该函数的新实例。这可能会为垃圾收集器带来大量工作。

```js
 class CommentList extends React.Component {
    state = {
        comments: [],
        selectedCommentId: null
    }

    render(){
        const { comments } = this.state;
        return (
           comments.map((comment)=>{
               return <Comment onClick={(e)=>{
                    this.setState({selectedCommentId:comment.commentId})
               }} comment={comment} key={comment.id}/>
           }) 
        )
    }
}

```
您可以定义箭头函数，而不是为 props 定义内联函数。

```js
default class CommentList extends React.Component {
    state = {
        comments: [],
        selectedCommentId: null
    }

    onCommentClick = (commentId)=>{
        this.setState({selectedCommentId:commentId})
    }

    render(){
        const { comments } = this.state;
        return (
           comments.map((comment)=>{
               return <Comment onClick={this.onCommentClick} 
                comment={comment} key={comment.id}/>
           }) 
        )
    }
}
```

#### 9. 使用防抖节流

节流：在规定时间内去触发一次，在这个时间内无论你做多少行为，我只触发一次行为

防抖：防止事件频繁触发，只在用户停止行为后，在延迟之后的时间触发

可以使用lodash

```js
import debouce from 'lodash.debounce';

class SearchComments extends React.Component {
 constructor(props) {
   super(props);
   this.state = { searchQuery: “” };
 }

 setSearchQuery = debounce(e => {
   this.setState({ searchQuery: e.target.value });
 }, 1000);

 render() {
   return (
     <div>
       <h1>Search Comments</h1>
       <input type="text" onChange={this.setSearchQuery} />
     </div>
   );
 }
}
```
#### 10. 避免使用 Index 作为 Map 的 Key

```js
{
    comments.map((comment, index) => {
        <Comment 
            {..comment}
            key={index} />
    })
}
```
使用index可能导致你的应用程序显示不正确，因为在diff的时候会使用到key；当你在删除、添加、移动列表的时候，key值相同的
元素已经不是同一个元素了。

在某些情况下可以使用index作为key

- 列表和项目是静态的
- 列表中的项目没有 ID，列表永远不会被重新排序或过滤
- 列表是不可变的

#### 11. 避免用props初始组件的状态

```js
class EditPanelComponent extends Component {
    
    constructor(props){
        super(props);

        this.state ={
            isEditMode: false,
            applyCoupon: props.applyCoupon
        }
    }

    render(){
        return <div>
                    {this.state.applyCoupon && 
                    <>Enter Coupon: <Input/></>}
               </div>
    }
}
```
如果在没有刷新组件的情况下更改了 props，则新的 props 值将永远不会分配给状态的applyCoupon,因为constructor只会在初始化的时候调用。

解决方法：可以componentWillReceiveProps，可以通过props来更新状态

```js
    
    constructor(props){
        super(props);

        this.state ={
            isEditMode: false,
            applyCoupon: props.applyCoupon
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.applyCoupon !== this.props.applyCoupon) {
            this.setState({ applyCoupon: nextProps.applyCoupon })
        }
    }

    render(){
        return <div>{this.props.applyCoupon && 
          <>Enter Coupon: <Input/></>}</div>
    }
}

```

#### 12. webpack 使用mode

webpack4 ,mode设置为`production`,webpack会使用内置优化

```js
 module.exports = {
      mode: 'production'
    };
```


#### 13. 在 DOM 元素上传播 props

这样做会添加未知的html属性，这是没有必要的

```js
const CommentsText = props => {
    return (
      <div {...props}>
        {props.text}
      </div>
    );
  };
```

可以设置特定属性

```js
const CommentsText = props => {
    return (
      <div specificAttr={props.specificAttr}>
        {props.text}
      </div>
    );
};
```

#### 14. CSS 动画代替 JS 动画

动画对于流畅和愉悦的用户体验来说是不可避免的。有很多方法可以实现网页动画。一般来说，我们可以通过三种方式创建动画：

CSS 过渡

CSS 动画

JavaScript
#### 15. CDN

CDN 可以将静态内容传输的更快，从您的网站或移动应用程序更快。

#### 16 Web Workers API 尝试

- Web Workers 使用后，Web应用程序可以：
    - 在独立于主线程的后台线程中运行一个脚本；
    - 在独立线程中执行费时的任务，避免一些耗时的任务阻断用户体验

- 通信机制 Web Worker执行完耗时任务后与主线程的通信
  - postMessage

```js
// sort.worker.js
export default  function sort() {
    
    self.addEventListener('message', e =>{
        if (!e) return;
        let posts = e.data;
        
        for (let index = 0, len = posts.length - 1; index < len; index++) {
            for (let count = index+1; count < posts.length; count++) {
                if (posts[index].commentCount > posts[count].commentCount) {
                    const temp = posts[index];
                    posts[index] = users[count];
                    posts[count] = temp;
                }
            }
        }
        postMessage(posts);
    });
}
export default Posts extends React.Component{

    constructor(props){
        super(posts);
    }
    state = {
        posts: this.props.posts
    }
    componentDidMount() {
        this.worker = new Worker('sort.worker.js');
        
        this.worker.addEventListener('message', event => {
            const sortedPosts = event.data;
            this.setState({
                posts: sortedPosts
            })
        });
    }

    doSortingByComment = () => {
        if(this.state.posts && this.state.posts.length){
            this.worker.postMessage(this.state.posts);
        }
    }
    
    render(){
        const posts = this.state.posts;
        return (
            <React.Fragment>
                <Button onClick={this.doSortingByComment}>
                    Sort By Comments
                </Button>
                <PostList posts={posts}></PostList>
            </React.Fragment>
        )
    }
}

```
#### 17. 虚拟化长列表

列表虚拟化或窗口化是一种在呈现长数据列表时提高性能的技术。这种技术在任何给定时间只渲染一小部分行，并且可以显着减少重新渲染组件所需的时间，以及创建的 DOM 节点的数量。

有一些流行的 React 库，比如react-window和react-virtualized，它们提供了几个可重用的组件来显示列表、网格和表格数据。

#### 18. 服务端渲染

可以参考最后一章，项目实战，有服务端渲染代码

#### 19. 在 Web 服务器上启用 Gzip 压缩

#### 20. useMemo进行缓存大量计算数据，useCallback 进行缓存函数，避免重复创建

在hooks章节有讲解
#### 21. 惰性初始化

优化前：

```js
function table(props) {
    const [state,setState]=useState(createRows(props.count))
}
// 上面这种写法，会导致，每次组件更新都要调用createRows，相当于下面的写法
const values = createRows(props.count)
const [state,setState]=useState(values)

```
优化后：

```js
function table(props) {
    const [state,setState]=useState(()=>{
       return createRows(props.count)
    })
}
```


#### 总结

建议先进行基准测试和测量性能。您可以考虑使用 Chrome 时间轴分析和可视化组件。可以查看哪些组件被卸载、安装、更新，以及它们相对于彼此所花费的时间。它将帮助您开始性能优化之旅。

### 7.3.3 扩展资料

[React Profiler 博客](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

[理解火焰图](http://www.brendangregg.com/flamegraphs.html)

[React Profiler API](https://reactjs.org/docs/profiler.html#gatsby-focus-wrapper)

[React 优化手段](https://www.codementor.io/blog/react-optimization-5wiwjnf9hj)

