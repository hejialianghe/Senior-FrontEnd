const express = require('express')

const router = express.Router();

router.get("/home", function (req, res, next) {
  res.json({ title: 'Home', desc: '这是home页面' })
});

router.get("/user", function (req, res, next) {
  res.json({ name: '张三', age: '21', id: '1' })
});

module.exports = router