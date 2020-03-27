/* @flow */
// 通过vNode类，实例化出不同的虚拟DOM节点
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag // 当前节点标签名
    this.data = data // 当前节点的数据对象，也就是标签上的属性；包括attrs,style,hook等具体包含的字段可以参考/types/vnode.d.ts
    this.children = children //数组类型，包含当前节点的子节点
    this.text = text // 当前节点的文本
    this.elm = elm // 当前虚拟节点对应的真实的dom节点
    this.ns = undefined // 节点的namespace（命名空间）
    this.context = context // 编译作用域，当前节点对应的vue实例
    this.fnContext = undefined // 函数组件化的作用域，当前组件对应的vue实例
    this.fnOptions = undefined  // 函数式组件Option选项
    this.fnScopeId = undefined
    this.key = data && data.key // 节点的key属性，用作节点的标识，有利于patch优化
    this.componentOptions = componentOptions // 创建组件实例时会用到的选项信息
    this.componentInstance = undefined //当前组件节点对应的vue实例
    this.parent = undefined //组件的占位节点
    this.raw = false // 是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false
    this.isStatic = false //静态节点标识
    this.isRootInsert = true // 是否作为根节点插入被<transition>包裹的节点，该属性的值为false
    this.isComment = false //当前节点是否是注释节点
    this.isCloned = false //当前节点是否为克隆节点
    this.isOnce = false // 当前节点是否有v-once指令
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
// 创建注释节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true //isComment为true，说明是一个注释节点
  return node
}

// 创建文本节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.


// 创建克隆节点
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
