"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchesRouter = void 0;
const express_1 = __importDefault(require("express"));
const launches_controller_1 = require("./launches.controller");
exports.launchesRouter = express_1.default.Router();
exports.launchesRouter.get('/', launches_controller_1.httpGetAllHistoricLaunches);
exports.launchesRouter.post('/', launches_controller_1.httpPostNewLaunch);
exports.launchesRouter.delete('/:id', launches_controller_1.httpAbortLaunch);
