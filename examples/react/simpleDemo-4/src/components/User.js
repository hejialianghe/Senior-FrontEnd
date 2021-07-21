import React from 'react';
import { fetchUser } from '../core/api'
import useData from '../core/useData'

const User = ({staticContext}) => {
  const [data, setData] = useData(staticContext, {}, fetchUser)
  return (
    <main>
      <h1>User:{JSON.stringify(data)}</h1>
      <button onClick={()=>{alert('user!')}}>click me</button>
    </main>
  )
}

User.getData = fetchUser
export default User
