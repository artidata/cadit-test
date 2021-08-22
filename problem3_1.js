const readline = require('readline')
const fs = require('fs')
const { tidy, mutate } = require('@tidyjs/tidy')

const sampleData = JSON.parse(fs.readFileSync(__dirname + '/JSON Files/sensor_data.json', 'utf8'))
let out = new Array(5).fill().map((val, ind) => ({ roomArea: `roomArea${ind+1}` }))

//New mock data at the start of the execution as waiting for 2 minutes for the data is not fun.
const date = Number(new Date())
out = tidy(
  out,
  mutate({
    temperature: d => sampleData.array[Math.floor(Math.random() * sampleData.array.length)].temperature,
    humidity: d => sampleData.array[Math.floor(Math.random() * sampleData.array.length)].humidity,
    timestamp: date,
  })
)
fs.writeFileSync(__dirname + `/output3/${date}.json`, JSON.stringify({ array: out }, null, 2))
console.log(JSON.stringify({ array: out }, null, 2),'\nNext data will arrive in 2 minutes!\nType q and press ENTER to quit!\n')
  
function problem3_1() {

  const interval = setInterval(function() {
    const date = Number(new Date())
    out = tidy(
      out,
      mutate({
        temperature: d => sampleData.array[Math.floor(Math.random() * sampleData.array.length)].temperature + (Number(d.roomArea.slice(-1)) - 3)*2, //temperature difference for each room
        humidity: d => sampleData.array[Math.floor(Math.random() * sampleData.array.length)].humidity,
        timestamp: date,
      })
    )
    fs.writeFileSync(__dirname + `/output3/${date}.json`, JSON.stringify({ array: out }, null, 2))
    console.log(JSON.stringify({ array: out }, null, 2), '\nNext data will arrive in 2 minutes!\nType q and press ENTER to quit!\n')
  }, 120000)

  return new Promise(function(resolve, reject) {
    let rl = readline.createInterface(process.stdin, process.stdout)
    rl.on('line', function(line) {
      if (line == 'q') {
        rl.close()
        return
      }
    }).on('close', function() {
      resolve('Quitting program...')
      clearInterval(interval)
    })
  })
}

async function run() {
  try {
    const result = await problem3_1()
    console.log(result)
  }
  catch (e) {
    console.log('failed:', e)
  }
}

run()