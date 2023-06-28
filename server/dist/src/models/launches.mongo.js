"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.launches = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const launchesSchema = new mongoose_1.default.Schema({
    flightNumber: Number,
    launchDate: Date,
    mission: String,
    rocket: String,
    customers: [String],
    success: Boolean,
    upcoming: Boolean,
    target: String,
});
Object.keys(launchesSchema.paths).forEach((path) => {
    if (path !== 'target') {
        launchesSchema.path(path).required(true);
    }
});
exports.launches = mongoose_1.default.model('Launch', launchesSchema);
