import axios from "axios";
import fs from 'fs';
import {expect} from 'chai';

const port: number = 8000;

describe("endpoint", () => {
    it("get rovers", async () => {
        const res = await axios.get(`http://localhost:${port}/rovers`)
        expect(res.data).to.deep.equal(JSON.parse(fs.readFileSync('response_rovers.json', 'utf-8')));

    })

    it("get photos", async () => {
        const res = await axios.get(`http://localhost:${port}/rovers/photos`)
        expect(res.data).to.deep.equal(JSON.parse(fs.readFileSync('response_photos.json', 'utf-8')));
    })
})