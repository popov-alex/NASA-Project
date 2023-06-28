"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const planets_router_js_1 = require("./routes/planets/planets.router.js");
const launches_router_js_1 = require("./routes/launches/launches.router.js");
exports.app = (0, express_1.default)();
exports.app.use((0, morgan_1.default)('common'));
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
}));
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
exports.app.use('/planets', planets_router_js_1.planetsRouter);
exports.app.use('/launches', launches_router_js_1.launchesRouter);
exports.app.get('*', (_req, res) => res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html')));
