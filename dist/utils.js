"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getDateRangeChunks = void 0;
const moment_range_1 = require("moment-range");
const Moment = __importStar(require("moment"));
const moment = (0, moment_range_1.extendMoment)(Moment);
const getDateRangeChunks = (startDate, endDate, chunkInDays) => {
    const range = moment.range(startDate, endDate);
    // Explicitly tell TypeScript that 'chunks' is an array of Moment objects
    const chunks = Array.from(range.by('days', { step: chunkInDays }));
    // Explicitly type 'dateRanges' as an array of objects with 'start' and 'end' as strings
    const dateRanges = [];
    for (let i = 0; i < chunks.length; i++) {
        dateRanges.push({
            start: i > 0 ? chunks[i].add(1, 'day').format('DD-MM-YYYY') : chunks[i].format('DD-MM-YYYY'),
            end: chunks[i + 1] ? chunks[i + 1].format('DD-MM-YYYY') : range.end.format('DD-MM-YYYY')
        });
    }
    return dateRanges;
};
exports.getDateRangeChunks = getDateRangeChunks;
const sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};
exports.sleep = sleep;
