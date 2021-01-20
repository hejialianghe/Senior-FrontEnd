module.exports = (req,res,next) => {
    res.header({
        'X-MUSIC': '121'
    })
    next()
}

