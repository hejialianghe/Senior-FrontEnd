//  Floyd 判圈 并得出交点
const c = {
    value: -4
  };

  const b = {
    value: 0
  };

  const a = {
    value: 2
  };

  const head = {
    value: 3
  };

  head.dep = a;
  a.dep = b;
  b.dep = c;
  c.dep = a;

// 方案2 判断是否存在环,如果存在，环从哪开始
const floyd2 = head => {

    //第一步判断是否有环
  if(!head || !head.dep) return -1
  let fast= head //快指针
  let slow= head //慢指针
  while(fast && fast.dep){
    fast=fast.dep.dep
    slow=slow.dep
    // 相等后，说明2者相遇了，说明存在循环
    if(fast===slow){
        break
    }
  }
  if(!fast || !fast.dep) return -1

/**
 * 第二步判断环从哪开始,当快慢指针在交点相遇后，假设快指针是慢指针的2倍，快指针在往前走，同时一个指针从开始位置走
 * 他们相遇后，就是环开始的位置
 */
  let start=head
  let pos=0
  while(start!==fast){
    pos++
    start = start.dep
    fast = fast.dep
  }
  return pos
};

console.log(floyd2(head)) //1