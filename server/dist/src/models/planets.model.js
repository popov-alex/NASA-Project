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
exports.loadPlanets = exports.savePlanet = exports.getAllPlanets = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const planets_mongo_1 = require("./planets.mongo");
const isPlanetHabitable = (planet) => planet.koi_disposition === 'CONFIRMED' &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6;
const getAllPlanets = () => planets_mongo_1.planets.find({}, { _id: 0, __v: 0 });
exports.getAllPlanets = getAllPlanets;
const savePlanet = (planet) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield planets_mongo_1.planets.updateOne({ keplerName: planet.kepler_name }, { keplerName: planet.kepler_name }, { upsert: true });
    }
    catch (err) {
        console.log(`Could not save ${err}`);
    }
});
exports.savePlanet = savePlanet;
const loadPlanets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new Promise((resolve, reject) => {
            fs_1.default.createReadStream(path_1.default.join('data', 'kepler_data.csv'))
                .pipe((0, csv_parse_1.parse)({
                comment: '#',
                columns: true,
            }))
                .on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
                if (isPlanetHabitable(data)) {
                    yield (0, exports.savePlanet)(data);
                }
            }))
                .on('error', reject)
                .on('end', resolve);
        });
        const numberOfPlanets = yield (0, exports.getAllPlanets)();
        console.log(`We found ${numberOfPlanets.length} planets habitable!`);
    }
    catch (err) {
        console.log('Error occurred', err);
        throw err;
    }
});
exports.loadPlanets = loadPlanets;
