let method = require('./Contract_Methods.js')

const express = require('express')
const { METHODS } = require('http')
const app = express()
app.use(express.json())

app.get('/', async (req,res) => {
  res.send(await contract.name())
})

app.get('/name', async(req,res)=>
{
  res.send(await contract.name())
} )

app.get('/symbol', async(req,res)=>
{
  res.send(await contract.symbol())
} )

app.get('/supply', async (req,res) => {
  res.send(await contract.totalSupply())
})

app.get('/balance/:id', async (req, res) => {
  var account = req.params.id
  res.send( await method.getBalanceOf(account))
})


const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
