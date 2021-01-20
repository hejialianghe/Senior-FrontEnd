const Mock = require('mockjs')

module.exports= ()=> {
    const data = Mock.mock({
        'playlists|100': [{
            'id|+1':1,
            'name': '@title',
            'cover': '@image'
        }]
    })
    return data
}