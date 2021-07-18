
const express = require('express')
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Document from './components/documnet'
import App from './components/app'
import { StaticRouter } from 'react-router-dom'
const router = express.Router()

router.get("*",  function (req, res, next) {

  const appString = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
    >
      <App />
    </StaticRouter>)

  const html = ReactDOMServer.renderToStaticMarkup(<Document>
    {appString}
  </Document>)
  console.log('html', html)

  res.status(200).send(html);
  
});

module.exports = router