import express, {Express, Request, Response} from 'express';
import axios from 'axios';
import * as fs from 'fs';

const cors = require('cors')
const app: Express = express();
const port = 8000;

app.use(express.json());
app.use(cors())
const router = express.Router();

type PhotoResponse = {
    id: number,
    sol: number,
    camera: object,
    img_src: string,
    earth_date: string,
    rover: object,
}

const appendAPIKey = (url: string): string => {
    if (url.includes("?")) {
        return url + "&api_key=R3aEfqlcda7ZCz47u5YO9B5rW7VpkL8UVdQHWN7c";
    }
    return url + "?api_key=R3aEfqlcda7ZCz47u5YO9B5rW7VpkL8UVdQHWN7c";
}

const trimData = (response: PhotoResponse): object => {
    return {
        id: response.id,
        img_src: response.img_src,
        earth_date: response.earth_date
    }
}

router.get('/test', (req: Request, res: Response) => res.send('Hello world !'));
router.get('/rovers', (req: Request, res: Response) => {
    if (req.query?.local === "true") {
        console.log("reading local file");
        res.send(JSON.parse(fs.readFileSync('response_rovers.json', 'utf-8')));
        return;
    }

    axios.get(appendAPIKey("https://api.nasa.gov/mars-photos/api/v1/rovers/"))
        .then((apiRes) => {
            res.send(apiRes.data);
        })
        .catch((err) => {
            res.send(err);
        });
})

router.get('/rovers/photos', (req: Request, res: Response) => {
    if (req.query?.local === "true") {
        console.log("reading local file");
        res.send(JSON.parse(fs.readFileSync('response_photos.json', 'utf-8')));
        return;
    }

    axios.get(appendAPIKey("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000"))
        .then((apiRes) => {
            res.send(apiRes.data.photos.map(trimData));
        });
})

router.get('/rovers/:rover/photos/:camera', (req: Request, res: Response) => {
    if (req.query?.local === "true") {
        console.log("reading local file");

        if (req.params.rover === "curiosity" && req.params.camera === "NAVCAM") {
            if ((req.query?.sol === "100" || req.body?.sol === "100") && req.query?.paginationStart === "1"
                && req.query?.paginationEnd === "3") {
                res.send(JSON.parse(fs.readFileSync('response_NAVCAM-sol=100-pagination=1-3.json', 'utf-8')));
                return;
            } else if (!req.query?.sol) {
                res.send(JSON.parse(fs.readFileSync('response_NAVCAM_curiosity.json', 'utf-8')));
                return;
            }
        }
        res.send("No local configuration found");

        return;
    }

    let url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/'+ req.params.rover + '/photos?camera='
        + req.params.camera;

    if (req.query?.sol) {
        url += "&sol=" + req.query?.sol;
    } else if (req.body?.sol) {
        url += "&sol=" + req.body?.sol;
    } else {
        url += "&sol=1000";
    }

    let startPage: number = 0;
    let endPage: number = 0;
    if (req.query?.page && !req.query?.paginationStart && !req.query?.paginationEnd) {
        startPage = parseInt(<string>req.query.page);
        endPage =  startPage;
    }

    if (req.query?.paginationStart && req.query?.paginationEnd) {
        startPage = parseInt(<string>req.query.paginationStart);
        endPage = parseInt(<string>req.query.paginationEnd);
    }

    let urls = []
    if (startPage == 0 && endPage == 0) {
        urls.push(url);
    } else {
        for (let i = startPage; i <= endPage; i++) {
            urls.push(url + "&page=" + i)
        }
    }


    const requests = urls.map((url) => axios.get(appendAPIKey(url)));

    axios.all(requests)
        .then((responses) => {
            let photosArray: any[] = []
            responses.forEach((apiRes) => {
                photosArray = photosArray.concat(apiRes.data.photos.map(trimData));
            });

            if (photosArray.length == 0) {
                res.status(404);
                res.send({status: "No photo found for the current settings"})
            } else {
                res.send(photosArray);
            }
        })
        .catch((err) => {
            res.send({status: err.message});
        })
})

app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});