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
    let d=[]
    // 如果有一个空字符串，就返回非空字符串长度
    if(n*m===0){
      return n+m
    }
    for(let i=0;i<n+1;i++){
      d.push([])
      for(let j=0;j<m+1;j++){
        if(i===0){
          // 初始化第一行
          d[i][j]=j
        }else if(j===0){
          // 初始化第一列
          d[i][j]=i
        }else if(word1[i-1]===word2[j-1]){
          d[i][j]=d[i-1][j-1]
        }else {
          d[i][j]=Math.min(d[i-1][j-1],d[i][j-1],d[i-1][j])+1
        }
      }
    }
    return d[n][m]
  }

  var minDistance=function(word1,word2){
    let dp=(new Array(word1.length+1)).fill(0).map((_,i)=>i)
    let last,tmp;
    for(let i=0;i<word2.length;i++){
      last=dp[0]
      dp[0]=i+1
      for (let j=0;j<word1.length;j++){
        if(word1[i]===word2[j]){
          tmp=1+Math.min(dp[j+1],dp[j],last-1)
        }else{
          tmp = 1+Math.min(dp[j+1],dp[j],last)
        }
        last=dp[j+1]
        dp[j+1]=tmp
      }
    }
    return dp[dp.length-1]
  }
  lsamples.forEach(({string1,string2,count})=>{
      console.log(minDistance(string1,string2),count)

  })
                                     