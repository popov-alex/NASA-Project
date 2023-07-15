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
exports.launchesRouter = void 0;
const express_1 = __importDefault(require("express"));
const queryHelpers_1 = require("../../common/queryHelpers");
const launches_service_1 = require("./launches.service");
exports.launchesRouter = express_1.default.Router();
exports.launchesRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, num } = req.query;
    const { pageSkip, pageSize } = (0, queryHelpers_1.getPagination)(size, num);
    const allLaunches = yield (0, launches_service_1.getAllHistoricLaunches)(pageSkip, pageSize);
    res.status(200).json(allLaunches);
}));
exports.launchesRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newLaunch = req.body;
    if (!newLaunch.mission ||
        !newLaunch.target ||
        !newLaunch.launchDate ||
        !newLaunch.rocket) {
        return res.status(401).json({
            error: 'Complete all fields',
        });
    }
    else if (!isNaN(newLaunch.launchDate)) {
        return res.status(401).json({
            error: 'Please provide the correct date',
        });
    }
    const newLaunchResult = yield (0, launches_service_1.postNewLaunch)(newLaunch);
    return res.status(201).json(newLaunchResult);
}));
exports.launchesRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const aborted = yield (0, launches_service_1.abortLaunch)(id);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch was not aborted',
        });
    }
    return res.status(200).json({
        success: `Successfully aborted launch with flightNumber ${id}`,
    });
}));
