
const express = require('express')
import React from 'react'
import ReactDOMserver from 'react-dom/server'
import Document from './documnet'
const router = express.Router()

const html = ReactDOMserver.renderToStaticMarkup(<Document/>)

router.get('/',(req,res)=>{
    res.send(html)
})
module.exports=router