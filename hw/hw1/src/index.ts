import express, {Request, Response} from 'express'

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

type Resolution =
    'P144'
    | 'P240'
    | 'P360'
    | 'P480'
    | 'P720'
    | 'P1080'
    | 'P1440'
    | 'P2160'

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

const app = express()
const port = 3000
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
    }
]
app.delete('/ht_01/api/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    res.send(204)
})

app.get('/hometask_01/api/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.post('/hometask_01/api/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title || '',
        author: req.body.author || '',
        canBeDownloaded: !!req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction || 21,
        createdAt: '' + new Date(),
        publicationDate: req.body.publicationDate || new Date(),
        availableResolutions: req.body.availableResolutions
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.get('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const video = videos.find(v => v.id === id)
    if (video) {
        res.send(video)
    } else {
        res.send(404)
    }
})

app.put('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const video = videos.find(v => v.id === id)
    if (video) {
        res.send(video)
    } else {
        res.send(404)
    }
})

app.put('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const video = videos.find(v => v.id === id)
    if (video) {
        res.send(video)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})