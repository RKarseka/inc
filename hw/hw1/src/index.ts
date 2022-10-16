import express, { Request, Response } from 'express'
import bodyParser from "body-parser"

// enum Resolutions {
//     P144 = 'P144',
//     P240 = 'P240',
//     P360 = 'P360',
//     P480 = 'P480',
//     P720 = 'P720',
//     P1080 = 'P1080',
//     P1440 = 'P1440',
//     P2160 = 'P2160'
// }

type Resolution = 'P144' | 'P240' | 'P360' | 'P480' | 'P720' | 'P1080' | 'P1440' | 'P2160'

interface IVideo {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  createdAt: string,
  publicationDate: string,
  availableResolutions: string[]
}

const resolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ]

const videos: IVideo[] = [
  {
    'id': 0,
    'title': 'string',
    'author': 'string',
    'canBeDownloaded': true,
    'minAgeRestriction': null,
    'createdAt': '2023-03-09T17:27:25.966Z',
    'publicationDate': '2023-03-09T17:27:25.966Z',
    'availableResolutions': [
      'P144'
    ]
  }, {
    'id': 1,
    'title': 'string',
    'author': 'string',
    'canBeDownloaded': true,
    'minAgeRestriction': null,
    'createdAt': '2023-03-09T17:27:25.966Z',
    'publicationDate': '2023-03-09T17:27:25.966Z',
    'availableResolutions': [
      'P144'
    ]
  }
]

const requiredFields = [ 'title', 'author' ]

const checkAvailableResolutions = (arr: string[]) => arr.every(r => resolutions.includes(r))

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.delete('/api/testing/all-data', (req: Request, res: Response) => {
  videos.length = 0
  res.sendStatus(204)
})

app.get('/api/videos', (req: Request, res: Response) => {
  res.send(videos)
})

app.post('/api/videos', (req: Request, res: Response) => {
  const title = req.body.title

  if (!title || title.length < 1 || title.length > 40) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "title length must be between 1 and 40",
          "field": "title"
        }
      ]
    })
    return
  }

  const author = req.body.author

  if (!author || author.length < 1 || req.body.author.length > 20) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "author length must be between 1 and 20",
          "field": "author"
        }
      ]
    })
    return
  }

  const availableResolutions: string[] = req.body.availableResolutions

  const resolutionsError = {
    "errorsMessages": [
      {
        "message": "resolutions format mistake",
        "field": "availableResolutions"
      }
    ]
  }
  if (!Array.isArray(availableResolutions)) {
    res.status(400).send(resolutionsError)
    return
  }

  if (availableResolutions.length) {
    if (!checkAvailableResolutions(availableResolutions)) {
      res.status(400).send(resolutionsError)
      return
    }
  } else {
    availableResolutions.push('P144')
  }
  const date = +new Date()

  const newVideo = {
    id: +(new Date()),
    title,
    author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date(date).toISOString(),
    publicationDate: new Date(date + 86400000).toISOString(),
    availableResolutions
  }
  videos.push(newVideo)
  res.status(201).send(newVideo)
})

app.get('/api/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const video = videos.find(v => v.id === id)
  if (video) {
    res.send(video)
  } else {
    res.send(404)
  }
})

app.put('/api/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const index = videos.findIndex(v => v.id === id)
  if (index === -1) {
    res.send(401)
    return
  }
  const video = videos[index]

  const title = req.body.title

  if (!title || title.length < 1 || title.length > 40) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "title length must be between 1 and 40",
          "field": "title"
        }
      ]
    })
    return
  }

  video.title = title

  const author = req.body.author

  if (!author || author.length < 1 || req.body.author.length > 20) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "author length must be between 1 and 20",
          "field": "author"
        }
      ]
    })
    return
  }

  video.author = author

  const availableResolutions: string[] = req.body.availableResolutions

  if (availableResolutions) {
    if (Array.isArray(availableResolutions) && checkAvailableResolutions(availableResolutions)) {
      video.availableResolutions = availableResolutions
    } else {
      res.status(400).send({
        "errorsMessages": [
          {
            "message": "resolutions format mistake",
            "field": "availableResolutions"
          }
        ]
      })
      return
    }
  }

  const canBeDownloaded = req.body.canBeDownloaded
  if (canBeDownloaded !== undefined) {
    if (typeof canBeDownloaded == "boolean") {
      video.canBeDownloaded = canBeDownloaded
    } else {
      res.status(400).send({
        "errorsMessages": [
          {
            "message": "canBeDownloaded format mistake",
            "field": "canBeDownloaded"
          }
        ]
      })
      return
    }
  }

  const minAgeRestriction = req.body.minAgeRestriction
  if (minAgeRestriction !== undefined) {
    if (minAgeRestriction === null || (Number.isInteger(minAgeRestriction) && minAgeRestriction > 1 && minAgeRestriction < 18)) {
      video.minAgeRestriction = minAgeRestriction
    } else {
      res.status(400).send({
        "errorsMessages": [
          {
            "message": "minAgeRestriction format mistake",
            "field": "minAgeRestriction"
          }
        ]
      })
      return
    }
  }

  const publicationDate = req.body.publicationDate
  if (minAgeRestriction !== undefined) {
    video.publicationDate = publicationDate
  }
  videos[index] = video

  res.send(204)

})

app.delete('/api/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const videoIndex = videos.findIndex(v => v.id === id)
  if (videoIndex !== -1) {
    videos.splice(videoIndex, 1)
    res.status(204)
  } else {
    res.send(404)
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${ port }`)
})