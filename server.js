const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const { v4: uuidv4 } = require('uuid')


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const k = 40

/**
 * Sync version; not rise event loop -> not create thread
 */
app.get('/big', (req, res) => {

    const name = uuidv4()

  console.time('big'+name)
  const data = fs.readFileSync('./rotten_tomatoes_movie_reviews.csv')

  for (let i = 0; i < k; i++) {
    fs.writeFileSync(`./${name}_${i}.csv`, data)
    console.log("write",name,  i)
  }

  for (let i = 0; i < k; i++) {
    if (fs.existsSync(`./${name}_${i}.csv`)) {
      fs.unlinkSync(`./${name}_${i}.csv`)
    }
  }
  console.timeEnd('big'+name)
  res.send('Read')
})

/**
 * Async version; rise event loop -> create thread
 */
app.get('/big/promises', async (req, res) => {

    const name = uuidv4()
    console.time('big/promises'+name)

    const data = await fs.promises.readFile('./rotten_tomatoes_movie_reviews.csv')

    for (let i = 0; i < k; i++) {
        await fs.promises.writeFile(`./${name}_${i}.csv`, data)
        console.log("write promise",name, i)
    }

    for (let i = 0; i < k; i++) {
        if (await fs.existsSync(`./${name}_${i}.csv`)) {
            await fs.promises.unlink(`./${name}_${i}.csv`)
        }
    }
    console.timeEnd('big/promises'+name)
    res.send('Read')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
