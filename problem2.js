const fs = require('fs')
const { tidy, mutate, groupBy, summarize, sum, min, max, median, mean } = require('@tidyjs/tidy')

const data1 = JSON.parse(fs.readFileSync(__dirname + '/JSON Files/sensor_data.json', 'utf8'))

const out = tidy(
  data1.array,
  mutate({ day: (d) => new Date(d.timestamp).toISOString().split('T')[0] }),
  groupBy(
    ['roomArea', 'day'], [summarize({
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
const data2 = fs.writeFileSync(__dirname + '/output/output-problem2.json', JSON.stringify({ array: out }, null, 2))
console.log({ array: out })