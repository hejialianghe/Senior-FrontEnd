
const express = require('express')
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Document from '../components/documnet'
import App from '../components/app'
import { StaticRouter,matchPath } from 'react-router-dom'
import routes from '../core/routes'
const router = express.Router()

router.get("*", async function (req, res, next) {
  let data = {}
  let getData = null
  routes.some(route => {
    const match = matchPath(req.path, route);
    if (match) {
      getData = (route.component || {}).getData
    }
    return match
  });
  
  if (typeof getData === 'function') {

    try {
      data = await getData()
    } catch (error) { }
  }
  const appString = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
      context={data}
    >
      <App />
    </StaticRouter>)

  const html = ReactDOMServer.renderToStaticMarkup(<Document data={data}>
    {appString}
  </Document>)

  res.status(200).send(html);

});

module.exports = router