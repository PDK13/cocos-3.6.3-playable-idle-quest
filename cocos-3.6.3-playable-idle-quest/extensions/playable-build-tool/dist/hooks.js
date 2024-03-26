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
exports.unload = exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onBeforeBuild = exports.load = exports.throwError = void 0;
const merge_1 = require("./merge");
const PACKAGE_NAME = "playable-build-tool";
function log(...arg) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}
let allAssets = [];
exports.throwError = true;
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
        allAssets = yield Editor.Message.request("asset-db", "query-assets");
    });
}
exports.load = load;
function onBeforeBuild(options) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.onBeforeBuild = onBeforeBuild;
function onBeforeCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.onBeforeCompressSettings = onBeforeCompressSettings;
function onAfterCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.onAfterCompressSettings = onAfterCompressSettings;
function onAfterBuild(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        const versionArray = Editor.App.version.split(".");
        const mainVersion = `${versionArray[0]}.${versionArray[1]}`;
        const availableVersion = ["3.2", "3.3", "3.4", "3.5", "3.6"];
        if (availableVersion.indexOf(mainVersion) < 0) {
            console.error(`Unsupported cocos version ${Editor.App.version}.\nPlease use cocos creator between 3.2 ~ 3.6.);`);
            return;
        }
        let fileType = "3.6";
        if (Number(versionArray[1]) <= 5)
            fileType = "3.5";
        const { adNetwork, isPlayable, gzip, loading } = options.packages[PACKAGE_NAME];
        if (isPlayable === true) {
            const mergeTool = new merge_1.MergeBuilder(result.paths.dir, options.name, fileType);
            yield mergeTool.merge(adNetwork, gzip, loading);
        }
        //fs.readFileSync()
    });
}
exports.onAfterBuild = onAfterBuild;
function unload() {
    console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
}
exports.unload = unload;
