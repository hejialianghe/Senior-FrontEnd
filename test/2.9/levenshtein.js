// 莱文斯坦距离问题
const lsamples = [
    {
      string1: "horse",
      string2: "ros",
      count: 3
    },
    {
      string1: "intention",
      string2: "execution",
      count: 3
    }
  ];

  const Levenshtein = (word1, word2) => {
    var n=word1.length
    var m=word2.length
    var minDist=Number.MAX_SAFE_INTEGER // 常数表示javaScript()中的最大安全整数
    function helper (i,j,edist){
        if(i==n || j==m){
            
        }
        // 如果字符窜相同就进行下一步的比较
        if(word1[i]==word2[j]){
            helper(i+1,j+1,edist)
        }else {
            helper()
             
        }
    }
    helper(0,0,0)
    return minDist
  }

  lsamples.forEach(({string1,string2,count})=>{
      console.log(Levenshtein(string1,string2),count)

  })
                                     