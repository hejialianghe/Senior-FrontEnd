
class Compile {
    constructor(el,vm){
        this.$el=document.querySelector(el)

        this.$vm=vm
        //编译
        if(this.$el){
            // 将内部内容转换为Fragment
            this.$fragment=this.node2Fragment(this.$el);
            // 执行编译
            this.compile(this.$fragment)
            // 将编译完的元素追加到$el中
            this.$el.appendChild(this.$fragment)
        }
  
    }

    node2Fragment(el){
        const frag=document.createDocumentFragment()
        let child
        // 将el中的元素搬家到frag中
        while ((child = el.firstChild)){
            frag.appendChild(child) //每添加一个节点，原有的dom树里面就减少一个节点
        }
        return frag
    }

    // 编译过程
    compile(el){
        const childNodes=el.childNodes
      
        Array.from(childNodes).forEach(node => {
         
          if(this.isElement(node)){ // 如果是标签元素
            const nodeAttrs=node.attributes;
            // 遍历元素的属性
            Array.from(nodeAttrs).forEach(attr=>{
                const attrName=attr.name; //属性名
                const exp=attr.value; //属性值,形如v-text=1,1是属性值
                // 如果是自定义指令t-text 或t-html
                if(this.isDirective(attrName)){ 
                    const dir = attrName.substring(2);
                    this[dir] &&  this[dir](node,this.$vm,exp)
                }
                // 如果是事件
                if(this.isEvent(attrName)){
                    const dir=attrName.substring(1)
                    this.eventHandler(node,this.$vm,dir,exp)
                }
            })
            if(this.isInterpolation(node)){
               this.compileText(node)
              }
          }
        });

    }
    update(node,vm,exp,dir){
        const updaterFn=this[dir+'Updater'];
        // 初始化
        updaterFn && updaterFn(node,vm[exp])
           // 依赖收集
      new Watcher(vm, exp, function(value) {
        updaterFn && updaterFn(node, value);
      });

    }
    // 给节点添加内容
    textUpdater(node, value) {
        node.textContent = value;
      }
  // 给节点添加标签
    htmlUpdater(node, value) {
        node.innerHTML = value;
    }
    modelUpdater(node, value) {
        node.value = value;
    }
    
    // 处理指令text
    text (node,vm,exp){
        this.update(node, vm, exp, "text");
   }

   html (node,vm,exp){
    this.update(node, vm, exp, "html")
   }
   model(node,vm,exp){
    this.update(node, vm, exp, "model")
    node.addEventListener('input',(e)=>{
        vm[exp]=e.target.value
    })
   }
  //绑定事件
   eventHandler(node,vm,dir,exp){
    let fn=vm.$options.methods && vm.$options.methods[exp]
    node.addEventListener(dir,fn.bind(vm))
   }
   compileText(node){
    this.update(node, this.$vm, RegExp.$1, "text")
   }

    isDirective(attr) {
        return attr.indexOf("t-") == 0;
      }
    isEvent (attr){
        return attr.indexOf('@')==0
    }
    isElement(node) {
        return node.nodeType === 1;
      }
        // 插值文本
    isInterpolation(node) {
        return node.nodeType === 1 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    
}