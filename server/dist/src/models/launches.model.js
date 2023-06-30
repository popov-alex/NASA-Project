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
exports.abortLaunch = exports.postNewLaunch = exports.getAllHistoricLaunches = exports.getSpaceXFlights = void 0;
const axios_1 = __importDefault(require("axios"));
const launches_mongo_1 = require("./launches.mongo");
const planets_mongo_1 = require("./planets.mongo");
const SPACEX_LAUNCHES_ENDPOINT = 'https://api.spacexdata.com/v4/launches/query';
const DEFAULT_LAUNCH_NUM = 100;
const defaultLaunch = {
    flightNumber: 100,
    launchDate: new Date('June 27, 2023'),
    mission: 'Landing on Marse',
    rocket: 'Souz',
    customers: ['Kris', 'Lena'],
    success: true,
    upcoming: true,
    target: 'Kepler-442 b',
};
const saveLaunch = (launch) => __awaiter(void 0, void 0, void 0, function* () {
    yield launches_mongo_1.launches.updateOne({ flightNumber: launch.flightNumber }, launch, {
        upsert: true,
    });
});
saveLaunch(defaultLaunch);
// interface SpaceXApiResponse {
//   docs: SpaceXLaunchDocType[];
//   totalDocs: number;
//   offset: number;
//   limit: number;
//   totalPages: number;
//   page: number;
//   pagingCounter: number;
//   hasPrevPage: boolean;
//   hasNextPage: boolean;
//   prevPage: number | null;
//   nextPage: number | null;
// }
// interface AxiosResponseFromSpaceX {
//   status: number;
//   statusText: string;
//   data: SpaceXApiResponse;
// }
const getSpaceXFlights = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(SPACEX_LAUNCHES_ENDPOINT, {
        query: {},
        options: {
            limit: 20,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });
    console.log(response.data);
    if (response.status !== 200) {
        console.error({
            error: 'Not able to load SpaceX launches',
        });
        throw new Error('Problem loading SpaceX launches');
    }
    response.data.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
        const customers = doc.payloads.flatMap((payload) => payload.customers);
        const launch = {
            flightNumber: doc.flight_number,
            launchDate: doc.date_local,
            mission: doc.name,
            rocket: doc.rocket.name,
            customers,
            success: doc.success,
            upcoming: doc.upcoming,
        };
        yield saveLaunch(launch);
    }));
});
exports.getSpaceXFlights = getSpaceXFlights;
const getAllHistoricLaunches = (pageNum, pageSize) => launches_mongo_1.launches
    .find({}, { _id: 0, __v: 0 })
    .sort('flightNumber')
    .skip(pageNum)
    .limit(pageSize);
exports.getAllHistoricLaunches = getAllHistoricLaunches;
const getLatestFlightNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const latestLaunch = yield launches_mongo_1.launches.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_LAUNCH_NUM;
    }
    return latestLaunch === null || latestLaunch === void 0 ? void 0 : latestLaunch.flightNumber;
});
const getNextFlightNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const latestLaunch = yield getLatestFlightNumber();
    const incrementedFlightNumber = latestLaunch
        ? latestLaunch + 1
        : DEFAULT_LAUNCH_NUM;
    return incrementedFlightNumber;
});
const postNewLaunch = (incomingLaunch) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistingPlanet = yield planets_mongo_1.planets.findOne({
        keplerName: incomingLaunch.target,
    });
    if (!isExistingPlanet) {
        throw new Error("Planet's name should be from the approved list");
    }
    const newLaunch = Object.assign({ flightNumber: yield getNextFlightNumber(), customers: defaultLaunch.customers, success: true, upcoming: true, launchDate: new Date(incomingLaunch.launchDate) }, incomingLaunch);
    try {
        yield saveLaunch(newLaunch);
    }
    catch (err) {
        console.error(err);
    }
});
exports.postNewLaunch = postNewLaunch;
const abortLaunch = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const abortedLaunch = yield launches_mongo_1.launches.updateOne({ flightNumber: id }, { upcoming: false, success: false });
    return abortedLaunch.modifiedCount === 1;
});
exports.abortLaunch = abortLaunch;
