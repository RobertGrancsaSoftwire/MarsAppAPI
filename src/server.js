"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json());
const router = express_1.default.Router();
const appendAPIKey = (url) => {
    if (url.includes("?")) {
        return url + "&api_key=R3aEfqlcda7ZCz47u5YO9B5rW7VpkL8UVdQHWN7c";
    }
    return url + "?api_key=R3aEfqlcda7ZCz47u5YO9B5rW7VpkL8UVdQHWN7c";
};
const trimData = (response) => {
    return {
        id: response.id,
        img_src: response.img_src,
        earth_date: response.earth_date
    };
};
router.get('/test', (req, res) => res.send('Hello world !'));
router.get('/rovers', (req, res) => {
    var _a;
    if (((_a = req.query) === null || _a === void 0 ? void 0 : _a.local) === "true") {
        console.log("reading local file");
        res.send(JSON.parse(fs.readFileSync('response_rovers.json', 'utf-8')));
        return;
    }
    axios_1.default.get(appendAPIKey("https://api.nasa.gov/mars-photos/api/v1/rovers/"))
        .then((apiRes) => {
        res.send(apiRes.data);
    })
        .catch((err) => {
        res.send(err);
    });
});
router.get('/rovers/photos', (req, res) => {
    var _a;
    if (((_a = req.query) === null || _a === void 0 ? void 0 : _a.local) === "true") {
        console.log("reading local file");
        res.send(JSON.parse(fs.readFileSync('response_photos.json', 'utf-8')));
        return;
    }
    axios_1.default.get(appendAPIKey("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000"))
        .then((apiRes) => {
        res.send(apiRes.data.photos.map(trimData));
    });
});
router.get('/rovers/:rover/photos/:camera', (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (((_a = req.query) === null || _a === void 0 ? void 0 : _a.local) === "true") {
        console.log("reading local file");
        if (req.params.rover === "curiosity" && req.params.camera === "NAVCAM") {
            if ((((_b = req.query) === null || _b === void 0 ? void 0 : _b.sol) === "100" || ((_c = req.body) === null || _c === void 0 ? void 0 : _c.sol) === "100") && ((_d = req.query) === null || _d === void 0 ? void 0 : _d.paginationStart) === "1"
                && ((_e = req.query) === null || _e === void 0 ? void 0 : _e.paginationEnd) === "3") {
                res.send(JSON.parse(fs.readFileSync('response_NAVCAM-sol=100-pagination=1-3.json', 'utf-8')));
                return;
            }
            else if (!((_f = req.query) === null || _f === void 0 ? void 0 : _f.sol)) {
                res.send(JSON.parse(fs.readFileSync('response_NAVCAM_curiosity.json', 'utf-8')));
                return;
            }
        }
        res.send("No local configuration found");
        return;
    }
    let url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + req.params.rover + '/photos?camera='
        + req.params.camera;
    if ((_g = req.query) === null || _g === void 0 ? void 0 : _g.sol) {
        url += "&sol=" + ((_h = req.query) === null || _h === void 0 ? void 0 : _h.sol);
    }
    else if ((_j = req.body) === null || _j === void 0 ? void 0 : _j.sol) {
        url += "&sol=" + ((_k = req.body) === null || _k === void 0 ? void 0 : _k.sol);
    }
    else {
        url += "&sol=1000";
    }
    let startPage = 0;
    let endPage = 0;
    if (((_l = req.query) === null || _l === void 0 ? void 0 : _l.page) && !((_m = req.query) === null || _m === void 0 ? void 0 : _m.paginationStart) && !((_o = req.query) === null || _o === void 0 ? void 0 : _o.paginationEnd)) {
        startPage = parseInt(req.query.page);
        endPage = startPage;
    }
    if (((_p = req.query) === null || _p === void 0 ? void 0 : _p.paginationStart) && ((_q = req.query) === null || _q === void 0 ? void 0 : _q.paginationEnd)) {
        startPage = parseInt(req.query.paginationStart);
        endPage = parseInt(req.query.paginationEnd);
    }
    let urls = [];
    if (startPage == 0 && endPage == 0) {
        urls.push(url);
    }
    else {
        for (let i = startPage; i <= endPage; i++) {
            urls.push(url + "&page=" + i);
        }
    }
    const requests = urls.map((url) => axios_1.default.get(appendAPIKey(url)));
    axios_1.default.all(requests)
        .then((responses) => {
        let photosArray = [];
        responses.forEach((apiRes) => {
            photosArray = photosArray.concat(apiRes.data.photos.map(trimData));
        });
        if (photosArray.length == 0) {
            res.send({ status: "No photo found for the current settings" });
        }
        else {
            res.send(photosArray);
        }
    })
        .catch((err) => {
        res.send({ status: err.message });
    });
});
app.use('/', router);
app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});
