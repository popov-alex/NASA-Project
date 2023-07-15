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
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAbortLaunch = exports.httpPostNewLaunch = exports.httpGetAllHistoricLaunches = void 0;
const launches_model_1 = require("../../models/launches.model");
const queryHelpers_1 = require("services/queryHelpers");
const httpGetAllHistoricLaunches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, num } = req.query;
    const { pageSkip, pageSize } = (0, queryHelpers_1.getPagination)(size, num);
    res.status(200).json(yield (0, launches_model_1.getAllHistoricLaunches)(pageSkip, pageSize));
});
exports.httpGetAllHistoricLaunches = httpGetAllHistoricLaunches;
const httpPostNewLaunch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newLaunch = req.body;
    console.log(newLaunch);
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
    yield (0, launches_model_1.postNewLaunch)(newLaunch);
    return res.status(201).json(newLaunch);
});
exports.httpPostNewLaunch = httpPostNewLaunch;
const httpAbortLaunch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const aborted = yield (0, launches_model_1.abortLaunch)(id);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch was not aborted',
        });
    }
    return res.status(200).json({
        success: `Successfully aborted launch with flightNumber ${id}`,
    });
});
exports.httpAbortLaunch = httpAbortLaunch;
