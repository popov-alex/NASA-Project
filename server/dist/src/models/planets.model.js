"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlanets = exports.loadPlanets = exports.savePlanets = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const planets_mongo_js_1 = require("./planets.mongo.js");
function isPlanetHabitable(planet) {
    return (planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 &&
        planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6);
}
const savePlanets = (planet) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield planets_mongo_js_1.planets.updateOne({ keplerName: planet.kepler_name }, { keplerName: planet.kepler_name }, { upsert: true });
    }
    catch (err) {
        console.log(`Could not save ${err}`);
    }
});
exports.savePlanets = savePlanets;
const loadPlanets = () => {
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(path_1.default.join(process.cwd(), 'data', 'kepler_data.csv'))
            .pipe((0, csv_parse_1.parse)({
            comment: '#',
            columns: true,
        }))
            .on('data', (data) => __awaiter(void 0, void 0, void 0, function* () { return isPlanetHabitable(data) && (yield (0, exports.savePlanets)(data)); }))
            .on('error', (err) => {
            console.log('Error occurred', err);
            reject(err);
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            const numberOfPlanets = yield (0, exports.getAllPlanets)();
            numberOfPlanets &&
                console.log(`We found ${numberOfPlanets.length} planets habitable!`);
            resolve();
        }));
    });
};
exports.loadPlanets = loadPlanets;
const getAllPlanets = () => planets_mongo_js_1.planets.find({}, { _id: 0, __v: 0 });
exports.getAllPlanets = getAllPlanets;
