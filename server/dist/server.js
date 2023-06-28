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
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("./src/services/mongo");
const app_js_1 = require("./src/app.js");
const planets_model_js_1 = require("./src/models/planets.model.js");
const launches_model_js_1 = require("./src/models/launches.model.js");
dotenv_1.default.config({ path: __dirname + '/../.env' });
const PORT = process.env.PORT || 8000;
const server = http_1.default.createServer(app_js_1.app);
(function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongo_1.mongoConnect)(process.env.MONGODB_URL);
            yield (0, launches_model_js_1.getSpaceXFlights)();
            yield (0, planets_model_js_1.loadPlanets)();
            server.listen(PORT, () => console.log(`I am happy to listen on PORT ${PORT}`));
        }
        catch (error) {
            console.error(`Error loading data: ${error}`);
        }
    });
})();
