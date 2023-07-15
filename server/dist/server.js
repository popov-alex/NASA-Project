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
const mongo_1 = require("./src/common/mongo");
const app_1 = require("./src/app");
const planets_service_1 = require("./src/planets/planets.service");
const launches_service_1 = require("./src/launches/launches.service");
dotenv_1.default.config({ path: __dirname + '/../.env' });
const PORT = process.env.PORT || 8000;
const server = http_1.default.createServer(app_1.app);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongo_1.mongoConnect)(process.env.MONGODB_URL);
        yield (0, launches_service_1.getSpaceXFlights)();
        yield (0, planets_service_1.loadPlanets)();
        server.listen(PORT, () => console.log(`I am happy to listen on PORT ${PORT}`));
    }
    catch (error) {
        console.error(`Error loading data: ${error}`);
    }
});
startServer();
