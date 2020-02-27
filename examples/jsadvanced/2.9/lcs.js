//递归求法
function lcs(str1, str2) {
    let length1 = str1.length;
    let length2 = str2.length;
    
    if(length1 === 0 || length2 === 0) {
      return 0;
    }
    
    let shortStr1 = str1.slice(0, -1);
    let shortStr2 = str2.slice(0, -1);
   
    if(str1[length1 - 1] === str2[length2 -  1]){
      return lcs(shortStr1, shortStr2) + 1;
    } else {
      let lcsShort2 = lcs(str1, shortStr2);
      let lcsShort1 = lcs(shortStr1, str2);
      return lcsShort1 > lcsShort2 ? lcsShort1 : lcsShort2;
    }
  }
  
  let result = lcs('ABBCBDE', 'DBBCD');

  // 动态规划求法
  const longestCommonSubsequence = (text1,text2) => {
     let dp=[(new Array(text2.length+1)).fill(0)] //初始化第一行
     for(let i=0;i<text1.length;i++){ //两个for循环遍历
       dp[i+1]=[0] //第一列
       for(let j=0;j<text2.length;j++){
         // 依据子结构倒推值
        if(text1[i]==text2[j]){
          dp[i+1][j+1]=dp[i][j]+1
        }else{
          dp[i+1][j+1]=Math.max(dp[i][j+1],dp[i+1][j])
     
        }
       }
     }
     console.log(dp)
     return dp[dp.length-1][dp[0].length-1]
  }
  let count=longestCommonSubsequence('ace','bcw')
  console.log(count)