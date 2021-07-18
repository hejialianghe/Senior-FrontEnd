import React from 'react'

const Document = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>simple-ssr</title>
  
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: children }}></div>
        <script src="main.js"></script>
      </body>
    </html>
  )
}
export default Document
