const root={
    val:"A",
    left:{
        val:'B',
        left:{
            val:"D"
        },
        right:{
            val:"E"
        }

    },
    right:{
        val:"C",
        right:{
            val:"F"
        }
    }
}
// 前序遍历
function preorder (root) {
 if(!root){
     return
 }
 console.log("当前遍历的节点是",root.val);
 // 递归遍历左子树
 preorder(root.left)
 // 递归遍历右子树
 preorder(root.right)
}
// preorder(root)

// 中序遍历
function inorder (root) {
    if(!root){
        return
    }
    // 递归遍历左子树
    inorder(root.left)
    console.log("当前遍历的节点是",root.val);
    // 递归遍历右子树
    inorder(root.right)
   }
//    inorder(root)

   // 中序遍历
function postorder (root) {
    if(!root){
        return
    }
    // 递归遍历左子树
    postorder(root.left)
    // 递归遍历右子树
    postorder(root.right)
    console.log("当前遍历的节点是",root.val);
   }
   postorder(root)



