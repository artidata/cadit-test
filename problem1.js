const axios = require('axios')
const fs = require('fs')
const { tidy, leftJoin, mutate } = require('@tidyjs/tidy')

let out

const problem1 = async() => {
  try {
    const res1 = await axios.get('https://jsonplaceholder.typicode.com/users')
    const data1 = JSON.parse(fs.readFileSync(__dirname + '/JSON Files/salary_data.json', 'utf8'))
    const res2 = await axios.get('https://free.currconv.com/api/v7/convert?q=IDR_USD&compact=ultra&apiKey=c2408e8e144076b9dae7')
    out = tidy(
      res1.data,
      leftJoin(data1.array, { by: ['id'] }),
      mutate({ salaryInUSD: d => d.salaryInIDR * res2.data.IDR_USD }))
    const data2 = fs.writeFileSync(__dirname + '/output/output-problem1.json', JSON.stringify({ array: out }, null, 2))
    console.log({ array: out })
  }
  catch (err) {
    console.error(err)
  }
}

problem1()