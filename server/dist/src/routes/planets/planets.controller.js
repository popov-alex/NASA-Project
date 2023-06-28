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
exports.httpGetAllPlanets = void 0;
const planets_model_js_1 = require("../../models/planets.model.js");
const queryHelpers_js_1 = require("../../services/queryHelpers.js");
const httpGetAllPlanets = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(yield (0, planets_model_js_1.getAllPlanets)());
});
exports.httpGetAllPlanets = httpGetAllPlanets;