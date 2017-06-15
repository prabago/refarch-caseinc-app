

const express = require('express');
const router = express.Router();

router.get('/items', function(req,res){
    body=[{'id':01,'name':"item 1","quantity":1,"img":"img2.png"},
    {'id':02,'name':"item 2","quantity":1,"img":"img2.png"}];
    res.status(200).send(body);
  });

router.post('/items',function(req,res){
  console.log(req.body);
  res.status(200).send(req.body);
});
module.exports = router;
