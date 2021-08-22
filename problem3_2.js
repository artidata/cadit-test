const readline = require('readline')
const fs = require('fs')
const { tidy, mutate, groupBy, summarize, sum, min, max, median, mean } = require('@tidyjs/tidy')

//Initial value to get the past 15 minutes data
let maxDate = Number(new Date())
let minDate = maxDate - 900000
let relevantDate =
  fs.readdirSync(__dirname + '/output3/')
  .map(val => Number(val.substring(0, val.length - 5)))
  .filter(val => val >= minDate & val <= maxDate)

let relevantData = []
relevantDate.forEach(val => {
  const data = JSON.parse(fs.readFileSync(__dirname + `/output3/${val}.json`, 'utf8'))
  relevantData.push(...data.array)
})

let aggregateDataRoom = tidy(
  relevantData,
  groupBy(
    ['roomArea'], [summarize({
      temperatureMin: min('temperature'),
      temperatureMax: max('temperature'),
      temperatureAvg: mean('temperature'),
      temperatureMedian: median('temperature'),
      humidityMin: min('humidity'),
      humidityMax: max('humidity'),
      humidityAvg: mean('humidity'),
      humidityMedian: median('humidity'),
    })]))

let aggregateDataAll = tidy(
  relevantData,
  summarize({
    temperatureMin: min('temperature'),
    temperatureMax: max('temperature'),
    temperatureAvg: mean('temperature'),
    temperatureMedian: median('temperature'),
    humidityMin: min('humidity'),
    humidityMax: max('humidity'),
    humidityAvg: mean('humidity'),
    humidityMedian: median('humidity'),
  })
)
console.log(`Aggregated reading from ${new Date(minDate).toISOString()} to ${new Date(maxDate).toISOString()}`)
console.log(`Number of log files = ${relevantDate.length}`)
console.log(aggregateDataRoom)
console.log(aggregateDataAll)
console.log('Next reading will arrive in 2 minutes!\nType q and press ENTER to quit!\n')

function problem3_2() {

  const interval = setInterval(function() {

    maxDate = Number(new Date())
    minDate = maxDate - 900000
    relevantDate =
      fs.readdirSync(__dirname + '/output3/')
      .map(val => Number(val.substring(0, val.length - 5)))
      .filter(val => val >= minDate & val <= maxDate)

    relevantData = []
    relevantDate.forEach(val => {
      const data = JSON.parse(fs.readFileSync(__dirname + `/output3/${val}.json`, 'utf8'))
      relevantData.push(...data.array)
    })

    aggregateDataRoom = tidy(
      relevantData,
      groupBy(
        ['roomArea'], [summarize({
          temperatureMin: min('temperature'),
          temperatureMax: max('temperature'),
          temperatureAvg: mean('temperature'),
          temperatureMedian: median('temperature'),
          humidityMin: min('humidity'),
          humidityMax: max('humidity'),
          humidityAvg: mean('humidity'),
          humidityMedian: median('humidity'),
        })])
    )

    aggregateDataAll = tidy(
      relevantData,
      summarize({
        temperatureMin: min('temperature'),
        temperatureMax: max('temperature'),
        temperatureAvg: mean('temperature'),
        temperatureMedian: median('temperature'),
        humidityMin: min('humidity'),
        humidityMax: max('humidity'),
        humidityAvg: mean('humidity'),
        humidityMedian: median('humidity'),
      })
    )

    console.log(`Aggregated reading from ${new Date(minDate).toISOString()} to ${new Date(maxDate).toISOString()}`)
    console.log(`Number of log files = ${relevantDate.length}`)
    console.log(aggregateDataRoom)
    console.log(aggregateDataAll)
    console.log('Next reading will arrive in 2 minutes!\nType q and press ENTER to quit!\n')
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
    const result = await problem3_2()
    console.log(result)
  }
  catch (e) {
    console.log('failed:', e)
  }
}

run()