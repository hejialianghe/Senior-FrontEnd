import React, { useState } from 'react';
import {fetchHome} from '../core/api'
import useData from '../core/useData'

const Home = ({staticContext}) => {
  const [data, setData] = useData(staticContext, { title: '', desc: ''}, fetchHome)
  return (
    <main>
      <h1>{data.title}</h1>
      <p>{data.desc}</p>
    </main>
  )
}
Home.getData = fetchHome

export default Home
