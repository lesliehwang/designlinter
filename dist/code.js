/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lintingFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lintingFunctions */ "./src/plugin/lintingFunctions.ts");

figma.showUI(__html__, { width: 360, height: 580 });
let borderRadiusArray = [0, 2, 4, 8, 16, 24, 32];
let originalNodeTree = [];
let lintVectors = false;
let lockedLogo = [];
figma.skipInvisibleInstanceChildren = true;
figma.ui.onmessage = msg => {
    if (msg.type === "close") {
        for (let i = 0; i < lockedLogo.length; i++) {
            lockedLogo[i].locked = false;
        }
        figma.closePlugin();
    }
    if (msg.type === "fetch-layer-data") {
        let layer = figma.getNodeById(msg.id);
        let layerArray = [];
        layerArray.push(layer);
        figma.currentPage.selection = layerArray;
        figma.viewport.scrollAndZoomIntoView(layerArray);
        let layerData = JSON.stringify(layer, [
            "id",
            "name",
            "description",
            "fills",
            "key",
            "type",
            "remote",
            "paints",
            "fontName",
            "fontSize",
            "font"
        ]);
        figma.ui.postMessage({
            type: "fetched layer",
            message: layerData
        });
    }
    if (msg.type === "update-errors") {
        figma.ui.postMessage({
            type: "updated errors",
            errors: lint(originalNodeTree)
        });
    }
    if (msg.type === "update-storage") {
        let arrayToBeStored = JSON.stringify(msg.storageArray);
        figma.clientStorage.setAsync("storedErrorsToIgnore", arrayToBeStored);
    }
    if (msg.type === "update-storage-from-settings") {
        let arrayToBeStored = JSON.stringify(msg.storageArray);
        figma.clientStorage.setAsync("storedErrorsToIgnore", arrayToBeStored);
        figma.ui.postMessage({
            type: "reset storage",
            storage: arrayToBeStored
        });
        figma.notify("Cleared ignored errors", { timeout: 1000 });
    }
    if (msg.type === "update-active-page-in-settings") {
        let pageToBeStored = JSON.stringify(msg.page);
        figma.clientStorage.setAsync("storedActivePage", pageToBeStored);
    }
    if (msg.type === "update-lint-rules-from-settings") {
        lintVectors = msg.boolean;
    }
    if (msg.type === "update-border-radius") {
        let newString = msg.radiusValues.replace(/\s+/g, "");
        let newRadiusArray = newString.split(",");
        newRadiusArray = newRadiusArray
            .filter(x => x.trim().length && !isNaN(x))
            .map(Number);
        if (newRadiusArray.indexOf(0) === -1) {
            newRadiusArray.unshift(0);
        }
        borderRadiusArray = newRadiusArray;
        let radiusToBeStored = JSON.stringify(borderRadiusArray);
        figma.clientStorage.setAsync("storedRadiusValues", radiusToBeStored);
        figma.ui.postMessage({
            type: "fetched border radius",
            storage: JSON.stringify(borderRadiusArray)
        });
        figma.notify("Saved new border radius values", { timeout: 1000 });
    }
    if (msg.type === "reset-border-radius") {
        borderRadiusArray = [0, 2, 4, 8, 16, 24, 32];
        figma.clientStorage.setAsync("storedRadiusValues", []);
        figma.ui.postMessage({
            type: "fetched border radius",
            storage: JSON.stringify(borderRadiusArray)
        });
        figma.notify("Reset border radius value", { timeout: 1000 });
    }
    if (msg.type === "select-multiple-layers") {
        const layerArray = msg.nodeArray;
        let nodesToBeSelected = [];
        layerArray.forEach(item => {
            let layer = figma.getNodeById(item);
            nodesToBeSelected.push(layer);
        });
        figma.currentPage.selection = nodesToBeSelected;
        figma.viewport.scrollAndZoomIntoView(nodesToBeSelected);
        figma.notify("Multiple layers selected", { timeout: 1000 });
    }
    function serializeNodes(nodes) {
        let serializedNodes = JSON.stringify(nodes, [
            "name",
            "type",
            "children",
            "id"
        ]);
        return serializedNodes;
    }
    function lint(nodes, lockedParentNode) {
        let errorArray = [];
        let childArray = [];
        nodes.forEach(node => {
            findName(node);
            let isLayerLocked;
            let newObject = {};
            newObject["id"] = node.id;
            let children = node.children;
            if (lockedParentNode === undefined && node.locked === true) {
                isLayerLocked = true;
            }
            else if (lockedParentNode === undefined && node.locked === false) {
                isLayerLocked = false;
            }
            else if (lockedParentNode === false && node.locked === true) {
                isLayerLocked = true;
            }
            else {
                isLayerLocked = lockedParentNode;
            }
            if (isLayerLocked === true) {
                newObject["errors"] = [];
            }
            else {
                newObject["errors"] = determineType(node);
            }
            if (!children) {
                errorArray.push(newObject);
                return;
            }
            else if (children) {
                node["children"].forEach(childNode => {
                    childArray.push(childNode.id);
                });
                newObject["children"] = childArray;
                if (isLayerLocked === true) {
                    errorArray.push(...lint(node["children"], true));
                }
                else {
                    errorArray.push(...lint(node["children"], false));
                }
            }
            errorArray.push(newObject);
        });
        return errorArray;
    }
    function findName(node) {
        let logoName = node.name;
        let lastCharacter = logoName.substring(logoName.length - 1, logoName.length);
        if (lastCharacter == ")") {
            node.locked = true;
            let flag = false;
            for (let i = 0; i < lockedLogo.length; i++) {
                if (lockedLogo[i].id == node.id) {
                    flag = true;
                }
            }
            if (flag == false) {
                lockedLogo.push(node);
            }
        }
    }
    if (msg.type === "lint-all") {
        figma.ui.postMessage({
            type: "complete",
            errors: lint(originalNodeTree),
            message: serializeNodes(msg.nodes)
        });
        figma.notify(`Design lint is running and will auto refresh for changes`, {
            timeout: 2000
        });
    }
    if (msg.type === "run-app") {
        if (figma.currentPage.selection.length === 0) {
            figma.notify("Select a frame(s) to get started", { timeout: 2000 });
            return;
        }
        else {
            let nodes = figma.currentPage.selection;
            let firstNode = [];
            firstNode.push(figma.currentPage.selection[0]);
            originalNodeTree = nodes;
            figma.ui.postMessage({
                type: "first node",
                message: serializeNodes(nodes),
                errors: lint(firstNode)
            });
            figma.clientStorage.getAsync("storedErrorsToIgnore").then(result => {
                figma.ui.postMessage({
                    type: "fetched storage",
                    storage: result
                });
            });
            figma.clientStorage.getAsync("storedActivePage").then(result => {
                figma.ui.postMessage({
                    type: "fetched active page",
                    storage: result
                });
            });
            figma.clientStorage.getAsync("storedRadiusValues").then(result => {
                if (result.length) {
                    borderRadiusArray = JSON.parse(result);
                    figma.ui.postMessage({
                        type: "fetched border radius",
                        storage: result
                    });
                }
            });
        }
    }
    function determineType(node) {
        switch (node.type) {
            case "SLICE":
            case "GROUP": {
                let errors = [];
                return errors;
            }
            case "BOOLEAN_OPERATION":
            case "VECTOR": {
                return lintVectorRules(node);
            }
            case "POLYGON":
            case "STAR":
            case "ELLIPSE": {
                return lintShapeRules(node);
            }
            case "FRAME": {
                return lintFrameRules(node);
            }
            case "INSTANCE":
            case "RECTANGLE": {
                return lintRectangleRules(node);
            }
            case "COMPONENT": {
                return lintComponentRules(node);
            }
            case "COMPONENT_SET": {
                return lintVariantWrapperRules(node);
            }
            case "TEXT": {
                return lintTextRules(node);
            }
            case "LINE": {
                return lintLineRules(node);
            }
            default: {
            }
        }
    }
    function lintComponentRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkRadius"])(node, errors, borderRadiusArray);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
        return errors;
    }
    function lintVariantWrapperRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
        return errors;
    }
    function lintLineRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        return errors;
    }
    function lintFrameRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkRadius"])(node, errors, borderRadiusArray);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        return errors;
    }
    function lintTextRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkType"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
        return errors;
    }
    function lintRectangleRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkRadius"])(node, errors, borderRadiusArray);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        return errors;
    }
    function lintVectorRules(node) {
        let errors = [];
        if (lintVectors === true) {
            Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
            Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
            Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        }
        return errors;
    }
    function lintShapeRules(node) {
        let errors = [];
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkFills"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkStrokes"])(node, errors);
        Object(_lintingFunctions__WEBPACK_IMPORTED_MODULE_0__["checkEffects"])(node, errors);
        return errors;
    }
};


/***/ }),

/***/ "./src/plugin/lintingFunctions.ts":
/*!****************************************!*\
  !*** ./src/plugin/lintingFunctions.ts ***!
  \****************************************/
/*! exports provided: createErrorObject, determineFill, checkRadius, customCheckTextFills, checkEffects, checkFills, checkStrokes, checkType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createErrorObject", function() { return createErrorObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "determineFill", function() { return determineFill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkRadius", function() { return checkRadius; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customCheckTextFills", function() { return customCheckTextFills; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkEffects", function() { return checkEffects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkFills", function() { return checkFills; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkStrokes", function() { return checkStrokes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkType", function() { return checkType; });
function createErrorObject(node, type, message, value) {
    let error = {
        message: "",
        type: "",
        node: "",
        value: ""
    };
    error.message = message;
    error.type = type;
    error.node = node;
    if (value !== undefined) {
        error.value = value;
    }
    return error;
}
function determineFill(fills) {
    let fillValues = [];
    fills.forEach(fill => {
        if (fill.type === "SOLID") {
            let rgbObj = convertColor(fill.color);
            fillValues.push(RGBToHex(rgbObj["r"], rgbObj["g"], rgbObj["b"]));
        }
        else if (fill.type === "IMAGE") {
            fillValues.push("Image - " + fill.imageHash);
        }
        else {
            const gradientValues = [];
            fill.gradientStops.forEach(gradientStops => {
                let gradientColorObject = convertColor(gradientStops.color);
                gradientValues.push(RGBToHex(gradientColorObject["r"], gradientColorObject["g"], gradientColorObject["b"]));
            });
            let gradientValueString = gradientValues.toString();
            fillValues.push(`${fill.type} ${gradientValueString}`);
        }
    });
    return fillValues[0];
}
function checkRadius(node, errors, radiusValues) {
    let cornerType = node.cornerRadius;
    if (typeof cornerType !== "symbol") {
        if (cornerType === 0) {
            return;
        }
    }
    if (typeof cornerType === "symbol") {
        if (radiusValues.indexOf(node.topLeftRadius) === -1) {
            return errors.push(createErrorObject(node, "radius", "Incorrect Top Left Radius", node.topRightRadius));
        }
        else if (radiusValues.indexOf(node.topRightRadius) === -1) {
            return errors.push(createErrorObject(node, "radius", "Incorrect top right radius", node.topRightRadius));
        }
        else if (radiusValues.indexOf(node.bottomLeftRadius) === -1) {
            return errors.push(createErrorObject(node, "radius", "Incorrect bottom left radius", node.bottomLeftRadius));
        }
        else if (radiusValues.indexOf(node.bottomRightRadius) === -1) {
            return errors.push(createErrorObject(node, "radius", "Incorrect bottom right radius", node.bottomRightRadius));
        }
        else {
            return;
        }
    }
    else {
        if (radiusValues.indexOf(node.cornerRadius) === -1) {
            return errors.push(createErrorObject(node, "radius", "Incorrect border radius", node.cornerRadius));
        }
        else {
            return;
        }
    }
}
function customCheckTextFills(node, errors) {
    const fillsToCheck = [
        "4b93d40f61be15e255e87948a715521c3ae957e6"
    ];
    let nodeFillStyle = node.fillStyleId;
    if (typeof nodeFillStyle === "symbol") {
        return errors.push(createErrorObject(node, "fill", "Mixing two styles together", "Multiple Styles"));
    }
    nodeFillStyle = nodeFillStyle.replace("S:", "");
    nodeFillStyle = nodeFillStyle.split(",")[0];
    if (nodeFillStyle !== "") {
        if (fillsToCheck.includes(nodeFillStyle)) {
            return errors.push(createErrorObject(node, "fill", "Incorrect text color use", "Using a background color on a text layer"));
        }
    }
    else {
        checkFills(node, errors);
    }
}
function checkEffects(node, errors) {
    if (node.effects.length && node.visible === true) {
        if (node.effectStyleId === "") {
            const effectsArray = [];
            node.effects.forEach(effect => {
                let effectsObject = {
                    type: "",
                    radius: "",
                    offsetX: "",
                    offsetY: "",
                    fill: "",
                    value: ""
                };
                effectsObject.radius = effect.radius;
                if (effect.type === "DROP_SHADOW") {
                    effectsObject.type = "Drop Shadow";
                }
                else if (effect.type === "INNER_SHADOW") {
                    effectsObject.type = "Inner Shadow";
                }
                else if (effect.type === "LAYER_BLUR") {
                    effectsObject.type = "Layer Blur";
                }
                else {
                    effectsObject.type = "Background Blur";
                }
                if (effect.color) {
                    let effectsFill = convertColor(effect.color);
                    effectsObject.fill = RGBToHex(effectsFill["r"], effectsFill["g"], effectsFill["b"]);
                    effectsObject.offsetX = effect.offset.x;
                    effectsObject.offsetY = effect.offset.y;
                    effectsObject.value = `${effectsObject.type} ${effectsObject.fill} ${effectsObject.radius}px X: ${effectsObject.offsetX}, Y: ${effectsObject.offsetY}`;
                }
                else {
                    effectsObject.value = `${effectsObject.type} ${effectsObject.radius}px`;
                }
                effectsArray.unshift(effectsObject);
            });
            let currentStyle = effectsArray[0].value;
            return errors.push(createErrorObject(node, "effects", "Missing effects style", currentStyle));
        }
        else {
            return;
        }
    }
}
function checkFills(node, errors) {
    if ((node.fills.length && node.visible === true) ||
        typeof node.fills === "symbol") {
        let nodeFills = node.fills;
        let fillStyleId = node.fillStyleId;
        if (typeof nodeFills === "symbol") {
            return errors.push(createErrorObject(node, "fill", "Missing fill style", "Mixed values"));
        }
        if (typeof fillStyleId === "symbol") {
            return errors.push(createErrorObject(node, "fill", "Missing fill style", "Mixed values"));
        }
        if (node.fillStyleId === "" &&
            node.fills[0].type !== "IMAGE" &&
            node.fills[0].visible === true) {
            return errors.push(createErrorObject(node, "fill", "Missing fill style", determineFill(node.fills)));
        }
        else {
            return;
        }
    }
}
function checkStrokes(node, errors) {
    if (node.strokes.length) {
        if (node.strokeStyleId === "" && node.visible === true) {
            let strokeObject = {
                strokeWeight: "",
                strokeAlign: "",
                strokeFills: []
            };
            strokeObject.strokeWeight = node.strokeWeight;
            strokeObject.strokeAlign = node.strokeAlign;
            strokeObject.strokeFills = determineFill(node.strokes);
            let currentStyle = `${strokeObject.strokeFills} / ${strokeObject.strokeWeight} / ${strokeObject.strokeAlign}`;
            return errors.push(createErrorObject(node, "stroke", "Missing stroke style", currentStyle));
        }
        else {
            return;
        }
    }
}
function checkType(node, errors) {
    if (node.textStyleId === "" && node.visible === true) {
        let textObject = {
            font: "",
            fontStyle: "",
            fontSize: "",
            lineHeight: {}
        };
        let fontStyle = node.fontName;
        let fontSize = node.fontName;
        if (typeof fontSize === "symbol") {
            return errors.push(createErrorObject(node, "text", "Missing text style", "Mixed sizes or families"));
        }
        if (typeof fontStyle === "symbol") {
            return errors.push(createErrorObject(node, "text", "Missing text style", "Mixed sizes or families"));
        }
        textObject.font = node.fontName.family;
        textObject.fontStyle = node.fontName.style;
        textObject.fontSize = node.fontSize;
        if (node.lineHeight.value !== undefined) {
            textObject.lineHeight = node.lineHeight.value;
        }
        else {
            textObject.lineHeight = "Auto";
        }
        let currentStyle = `${textObject.font} ${textObject.fontStyle} / ${textObject.fontSize} (${textObject.lineHeight} line-height)`;
        return errors.push(createErrorObject(node, "text", "Missing text style", currentStyle));
    }
    else {
        return;
    }
}
const convertColor = color => {
    const colorObj = color;
    const figmaColor = {};
    Object.entries(colorObj).forEach(cf => {
        const [key, value] = cf;
        if (["r", "g", "b"].includes(key)) {
            figmaColor[key] = (255 * value).toFixed(0);
        }
        if (key === "a") {
            figmaColor[key] = value;
        }
    });
    return figmaColor;
};
function RGBToHex(r, g, b) {
    r = Number(r).toString(16);
    g = Number(g).toString(16);
    b = Number(b).toString(16);
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    return "#" + r + g + b;
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGluZ0Z1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBb0c7QUFDcEcsd0JBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsZ0RBQWdELGdCQUFnQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULHdEQUF3RCxnQkFBZ0I7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsbURBQW1ELGdCQUFnQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esa0RBQWtELGdCQUFnQjtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVCQUF1QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsOERBQThELGdCQUFnQjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvRUFBVTtBQUNsQixRQUFRLHFFQUFXO0FBQ25CLFFBQVEsc0VBQVk7QUFDcEIsUUFBUSxzRUFBWTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0VBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNFQUFZO0FBQ3BCLFFBQVEsc0VBQVk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9FQUFVO0FBQ2xCLFFBQVEsc0VBQVk7QUFDcEIsUUFBUSxxRUFBVztBQUNuQixRQUFRLHNFQUFZO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxtRUFBUztBQUNqQixRQUFRLG9FQUFVO0FBQ2xCLFFBQVEsc0VBQVk7QUFDcEIsUUFBUSxzRUFBWTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0VBQVU7QUFDbEIsUUFBUSxxRUFBVztBQUNuQixRQUFRLHNFQUFZO0FBQ3BCLFFBQVEsc0VBQVk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0VBQVU7QUFDdEIsWUFBWSxzRUFBWTtBQUN4QixZQUFZLHNFQUFZO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9FQUFVO0FBQ2xCLFFBQVEsc0VBQVk7QUFDcEIsUUFBUSxzRUFBWTtBQUNwQjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNoVUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsK0JBQStCLFVBQVUsR0FBRyxvQkFBb0I7QUFDaEU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsbUJBQW1CLEdBQUcsbUJBQW1CLEdBQUcscUJBQXFCLFFBQVEsc0JBQXNCLE9BQU8sc0JBQXNCO0FBQ3pLO0FBQ0E7QUFDQSw2Q0FBNkMsbUJBQW1CLEdBQUcscUJBQXFCO0FBQ3hGO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MseUJBQXlCLEtBQUssMEJBQTBCLEtBQUsseUJBQXlCO0FBQ3hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsZ0JBQWdCLEdBQUcscUJBQXFCLEtBQUssb0JBQW9CLElBQUksc0JBQXNCO0FBQ3pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCJpbXBvcnQgeyBjaGVja1JhZGl1cywgY2hlY2tFZmZlY3RzLCBjaGVja0ZpbGxzLCBjaGVja1N0cm9rZXMsIGNoZWNrVHlwZSB9IGZyb20gXCIuL2xpbnRpbmdGdW5jdGlvbnNcIjtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzYwLCBoZWlnaHQ6IDU4MCB9KTtcbmxldCBib3JkZXJSYWRpdXNBcnJheSA9IFswLCAyLCA0LCA4LCAxNiwgMjQsIDMyXTtcbmxldCBvcmlnaW5hbE5vZGVUcmVlID0gW107XG5sZXQgbGludFZlY3RvcnMgPSBmYWxzZTtcbmxldCBsb2NrZWRMb2dvID0gW107XG5maWdtYS5za2lwSW52aXNpYmxlSW5zdGFuY2VDaGlsZHJlbiA9IHRydWU7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjbG9zZVwiKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9ja2VkTG9nby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbG9ja2VkTG9nb1tpXS5sb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwiZmV0Y2gtbGF5ZXItZGF0YVwiKSB7XG4gICAgICAgIGxldCBsYXllciA9IGZpZ21hLmdldE5vZGVCeUlkKG1zZy5pZCk7XG4gICAgICAgIGxldCBsYXllckFycmF5ID0gW107XG4gICAgICAgIGxheWVyQXJyYXkucHVzaChsYXllcik7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGxheWVyQXJyYXk7XG4gICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhsYXllckFycmF5KTtcbiAgICAgICAgbGV0IGxheWVyRGF0YSA9IEpTT04uc3RyaW5naWZ5KGxheWVyLCBbXG4gICAgICAgICAgICBcImlkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIixcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIixcbiAgICAgICAgICAgIFwiZmlsbHNcIixcbiAgICAgICAgICAgIFwia2V5XCIsXG4gICAgICAgICAgICBcInR5cGVcIixcbiAgICAgICAgICAgIFwicmVtb3RlXCIsXG4gICAgICAgICAgICBcInBhaW50c1wiLFxuICAgICAgICAgICAgXCJmb250TmFtZVwiLFxuICAgICAgICAgICAgXCJmb250U2l6ZVwiLFxuICAgICAgICAgICAgXCJmb250XCJcbiAgICAgICAgXSk7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZmV0Y2hlZCBsYXllclwiLFxuICAgICAgICAgICAgbWVzc2FnZTogbGF5ZXJEYXRhXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwidXBkYXRlLWVycm9yc1wiKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IFwidXBkYXRlZCBlcnJvcnNcIixcbiAgICAgICAgICAgIGVycm9yczogbGludChvcmlnaW5hbE5vZGVUcmVlKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInVwZGF0ZS1zdG9yYWdlXCIpIHtcbiAgICAgICAgbGV0IGFycmF5VG9CZVN0b3JlZCA9IEpTT04uc3RyaW5naWZ5KG1zZy5zdG9yYWdlQXJyYXkpO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKFwic3RvcmVkRXJyb3JzVG9JZ25vcmVcIiwgYXJyYXlUb0JlU3RvcmVkKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInVwZGF0ZS1zdG9yYWdlLWZyb20tc2V0dGluZ3NcIikge1xuICAgICAgICBsZXQgYXJyYXlUb0JlU3RvcmVkID0gSlNPTi5zdHJpbmdpZnkobXNnLnN0b3JhZ2VBcnJheSk7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoXCJzdG9yZWRFcnJvcnNUb0lnbm9yZVwiLCBhcnJheVRvQmVTdG9yZWQpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcInJlc2V0IHN0b3JhZ2VcIixcbiAgICAgICAgICAgIHN0b3JhZ2U6IGFycmF5VG9CZVN0b3JlZFxuICAgICAgICB9KTtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiQ2xlYXJlZCBpZ25vcmVkIGVycm9yc1wiLCB7IHRpbWVvdXQ6IDEwMDAgfSk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJ1cGRhdGUtYWN0aXZlLXBhZ2UtaW4tc2V0dGluZ3NcIikge1xuICAgICAgICBsZXQgcGFnZVRvQmVTdG9yZWQgPSBKU09OLnN0cmluZ2lmeShtc2cucGFnZSk7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoXCJzdG9yZWRBY3RpdmVQYWdlXCIsIHBhZ2VUb0JlU3RvcmVkKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInVwZGF0ZS1saW50LXJ1bGVzLWZyb20tc2V0dGluZ3NcIikge1xuICAgICAgICBsaW50VmVjdG9ycyA9IG1zZy5ib29sZWFuO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwidXBkYXRlLWJvcmRlci1yYWRpdXNcIikge1xuICAgICAgICBsZXQgbmV3U3RyaW5nID0gbXNnLnJhZGl1c1ZhbHVlcy5yZXBsYWNlKC9cXHMrL2csIFwiXCIpO1xuICAgICAgICBsZXQgbmV3UmFkaXVzQXJyYXkgPSBuZXdTdHJpbmcuc3BsaXQoXCIsXCIpO1xuICAgICAgICBuZXdSYWRpdXNBcnJheSA9IG5ld1JhZGl1c0FycmF5XG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC50cmltKCkubGVuZ3RoICYmICFpc05hTih4KSlcbiAgICAgICAgICAgIC5tYXAoTnVtYmVyKTtcbiAgICAgICAgaWYgKG5ld1JhZGl1c0FycmF5LmluZGV4T2YoMCkgPT09IC0xKSB7XG4gICAgICAgICAgICBuZXdSYWRpdXNBcnJheS51bnNoaWZ0KDApO1xuICAgICAgICB9XG4gICAgICAgIGJvcmRlclJhZGl1c0FycmF5ID0gbmV3UmFkaXVzQXJyYXk7XG4gICAgICAgIGxldCByYWRpdXNUb0JlU3RvcmVkID0gSlNPTi5zdHJpbmdpZnkoYm9yZGVyUmFkaXVzQXJyYXkpO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKFwic3RvcmVkUmFkaXVzVmFsdWVzXCIsIHJhZGl1c1RvQmVTdG9yZWQpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcImZldGNoZWQgYm9yZGVyIHJhZGl1c1wiLFxuICAgICAgICAgICAgc3RvcmFnZTogSlNPTi5zdHJpbmdpZnkoYm9yZGVyUmFkaXVzQXJyYXkpXG4gICAgICAgIH0pO1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJTYXZlZCBuZXcgYm9yZGVyIHJhZGl1cyB2YWx1ZXNcIiwgeyB0aW1lb3V0OiAxMDAwIH0pO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwicmVzZXQtYm9yZGVyLXJhZGl1c1wiKSB7XG4gICAgICAgIGJvcmRlclJhZGl1c0FycmF5ID0gWzAsIDIsIDQsIDgsIDE2LCAyNCwgMzJdO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKFwic3RvcmVkUmFkaXVzVmFsdWVzXCIsIFtdKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogXCJmZXRjaGVkIGJvcmRlciByYWRpdXNcIixcbiAgICAgICAgICAgIHN0b3JhZ2U6IEpTT04uc3RyaW5naWZ5KGJvcmRlclJhZGl1c0FycmF5KVxuICAgICAgICB9KTtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiUmVzZXQgYm9yZGVyIHJhZGl1cyB2YWx1ZVwiLCB7IHRpbWVvdXQ6IDEwMDAgfSk7XG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJzZWxlY3QtbXVsdGlwbGUtbGF5ZXJzXCIpIHtcbiAgICAgICAgY29uc3QgbGF5ZXJBcnJheSA9IG1zZy5ub2RlQXJyYXk7XG4gICAgICAgIGxldCBub2Rlc1RvQmVTZWxlY3RlZCA9IFtdO1xuICAgICAgICBsYXllckFycmF5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBsZXQgbGF5ZXIgPSBmaWdtYS5nZXROb2RlQnlJZChpdGVtKTtcbiAgICAgICAgICAgIG5vZGVzVG9CZVNlbGVjdGVkLnB1c2gobGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gbm9kZXNUb0JlU2VsZWN0ZWQ7XG4gICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2Rlc1RvQmVTZWxlY3RlZCk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIk11bHRpcGxlIGxheWVycyBzZWxlY3RlZFwiLCB7IHRpbWVvdXQ6IDEwMDAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZU5vZGVzKG5vZGVzKSB7XG4gICAgICAgIGxldCBzZXJpYWxpemVkTm9kZXMgPSBKU09OLnN0cmluZ2lmeShub2RlcywgW1xuICAgICAgICAgICAgXCJuYW1lXCIsXG4gICAgICAgICAgICBcInR5cGVcIixcbiAgICAgICAgICAgIFwiY2hpbGRyZW5cIixcbiAgICAgICAgICAgIFwiaWRcIlxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZWROb2RlcztcbiAgICB9XG4gICAgZnVuY3Rpb24gbGludChub2RlcywgbG9ja2VkUGFyZW50Tm9kZSkge1xuICAgICAgICBsZXQgZXJyb3JBcnJheSA9IFtdO1xuICAgICAgICBsZXQgY2hpbGRBcnJheSA9IFtdO1xuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgZmluZE5hbWUobm9kZSk7XG4gICAgICAgICAgICBsZXQgaXNMYXllckxvY2tlZDtcbiAgICAgICAgICAgIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgICAgICAgICAgIG5ld09iamVjdFtcImlkXCJdID0gbm9kZS5pZDtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgICAgICAgICBpZiAobG9ja2VkUGFyZW50Tm9kZSA9PT0gdW5kZWZpbmVkICYmIG5vZGUubG9ja2VkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaXNMYXllckxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChsb2NrZWRQYXJlbnROb2RlID09PSB1bmRlZmluZWQgJiYgbm9kZS5sb2NrZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaXNMYXllckxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobG9ja2VkUGFyZW50Tm9kZSA9PT0gZmFsc2UgJiYgbm9kZS5sb2NrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpc0xheWVyTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTGF5ZXJMb2NrZWQgPSBsb2NrZWRQYXJlbnROb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTGF5ZXJMb2NrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3RbXCJlcnJvcnNcIl0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtcImVycm9yc1wiXSA9IGRldGVybWluZVR5cGUobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JBcnJheS5wdXNoKG5ld09iamVjdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBub2RlW1wiY2hpbGRyZW5cIl0uZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZEFycmF5LnB1c2goY2hpbGROb2RlLmlkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3RbXCJjaGlsZHJlblwiXSA9IGNoaWxkQXJyYXk7XG4gICAgICAgICAgICAgICAgaWYgKGlzTGF5ZXJMb2NrZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JBcnJheS5wdXNoKC4uLmxpbnQobm9kZVtcImNoaWxkcmVuXCJdLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckFycmF5LnB1c2goLi4ubGludChub2RlW1wiY2hpbGRyZW5cIl0sIGZhbHNlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXJyb3JBcnJheS5wdXNoKG5ld09iamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZXJyb3JBcnJheTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZE5hbWUobm9kZSkge1xuICAgICAgICBsZXQgbG9nb05hbWUgPSBub2RlLm5hbWU7XG4gICAgICAgIGxldCBsYXN0Q2hhcmFjdGVyID0gbG9nb05hbWUuc3Vic3RyaW5nKGxvZ29OYW1lLmxlbmd0aCAtIDEsIGxvZ29OYW1lLmxlbmd0aCk7XG4gICAgICAgIGlmIChsYXN0Q2hhcmFjdGVyID09IFwiKVwiKSB7XG4gICAgICAgICAgICBub2RlLmxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICBsZXQgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NrZWRMb2dvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2tlZExvZ29baV0uaWQgPT0gbm9kZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmxhZyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGxvY2tlZExvZ28ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwibGludC1hbGxcIikge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBcImNvbXBsZXRlXCIsXG4gICAgICAgICAgICBlcnJvcnM6IGxpbnQob3JpZ2luYWxOb2RlVHJlZSksXG4gICAgICAgICAgICBtZXNzYWdlOiBzZXJpYWxpemVOb2Rlcyhtc2cubm9kZXMpXG4gICAgICAgIH0pO1xuICAgICAgICBmaWdtYS5ub3RpZnkoYERlc2lnbiBsaW50IGlzIHJ1bm5pbmcgYW5kIHdpbGwgYXV0byByZWZyZXNoIGZvciBjaGFuZ2VzYCwge1xuICAgICAgICAgICAgdGltZW91dDogMjAwMFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInJ1bi1hcHBcIikge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KFwiU2VsZWN0IGEgZnJhbWUocykgdG8gZ2V0IHN0YXJ0ZWRcIiwgeyB0aW1lb3V0OiAyMDAwIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICAgICAgbGV0IGZpcnN0Tm9kZSA9IFtdO1xuICAgICAgICAgICAgZmlyc3ROb2RlLnB1c2goZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgICAgIG9yaWdpbmFsTm9kZVRyZWUgPSBub2RlcztcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImZpcnN0IG5vZGVcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBzZXJpYWxpemVOb2Rlcyhub2RlcyksXG4gICAgICAgICAgICAgICAgZXJyb3JzOiBsaW50KGZpcnN0Tm9kZSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhcInN0b3JlZEVycm9yc1RvSWdub3JlXCIpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZmV0Y2hlZCBzdG9yYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0b3JhZ2U6IHJlc3VsdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKFwic3RvcmVkQWN0aXZlUGFnZVwiKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImZldGNoZWQgYWN0aXZlIHBhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZTogcmVzdWx0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoXCJzdG9yZWRSYWRpdXNWYWx1ZXNcIikudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1c0FycmF5ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImZldGNoZWQgYm9yZGVyIHJhZGl1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZTogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRldGVybWluZVR5cGUobm9kZSkge1xuICAgICAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIlNMSUNFXCI6XG4gICAgICAgICAgICBjYXNlIFwiR1JPVVBcIjoge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkJPT0xFQU5fT1BFUkFUSU9OXCI6XG4gICAgICAgICAgICBjYXNlIFwiVkVDVE9SXCI6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGludFZlY3RvclJ1bGVzKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIlBPTFlHT05cIjpcbiAgICAgICAgICAgIGNhc2UgXCJTVEFSXCI6XG4gICAgICAgICAgICBjYXNlIFwiRUxMSVBTRVwiOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbnRTaGFwZVJ1bGVzKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkZSQU1FXCI6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGludEZyYW1lUnVsZXMobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiSU5TVEFOQ0VcIjpcbiAgICAgICAgICAgIGNhc2UgXCJSRUNUQU5HTEVcIjoge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW50UmVjdGFuZ2xlUnVsZXMobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwiQ09NUE9ORU5UXCI6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGludENvbXBvbmVudFJ1bGVzKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIkNPTVBPTkVOVF9TRVRcIjoge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW50VmFyaWFudFdyYXBwZXJSdWxlcyhub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJURVhUXCI6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGludFRleHRSdWxlcyhub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJMSU5FXCI6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGludExpbmVSdWxlcyhub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBsaW50Q29tcG9uZW50UnVsZXMobm9kZSkge1xuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGNoZWNrRmlsbHMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgY2hlY2tSYWRpdXMobm9kZSwgZXJyb3JzLCBib3JkZXJSYWRpdXNBcnJheSk7XG4gICAgICAgIGNoZWNrRWZmZWN0cyhub2RlLCBlcnJvcnMpO1xuICAgICAgICBjaGVja1N0cm9rZXMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9XG4gICAgZnVuY3Rpb24gbGludFZhcmlhbnRXcmFwcGVyUnVsZXMobm9kZSkge1xuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGNoZWNrRmlsbHMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgcmV0dXJuIGVycm9ycztcbiAgICB9XG4gICAgZnVuY3Rpb24gbGludExpbmVSdWxlcyhub2RlKSB7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgY2hlY2tTdHJva2VzKG5vZGUsIGVycm9ycyk7XG4gICAgICAgIGNoZWNrRWZmZWN0cyhub2RlLCBlcnJvcnMpO1xuICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW50RnJhbWVSdWxlcyhub2RlKSB7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgY2hlY2tGaWxscyhub2RlLCBlcnJvcnMpO1xuICAgICAgICBjaGVja1N0cm9rZXMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgY2hlY2tSYWRpdXMobm9kZSwgZXJyb3JzLCBib3JkZXJSYWRpdXNBcnJheSk7XG4gICAgICAgIGNoZWNrRWZmZWN0cyhub2RlLCBlcnJvcnMpO1xuICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW50VGV4dFJ1bGVzKG5vZGUpIHtcbiAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xuICAgICAgICBjaGVja1R5cGUobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgY2hlY2tGaWxscyhub2RlLCBlcnJvcnMpO1xuICAgICAgICBjaGVja0VmZmVjdHMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgY2hlY2tTdHJva2VzKG5vZGUsIGVycm9ycyk7XG4gICAgICAgIHJldHVybiBlcnJvcnM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxpbnRSZWN0YW5nbGVSdWxlcyhub2RlKSB7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgY2hlY2tGaWxscyhub2RlLCBlcnJvcnMpO1xuICAgICAgICBjaGVja1JhZGl1cyhub2RlLCBlcnJvcnMsIGJvcmRlclJhZGl1c0FycmF5KTtcbiAgICAgICAgY2hlY2tTdHJva2VzKG5vZGUsIGVycm9ycyk7XG4gICAgICAgIGNoZWNrRWZmZWN0cyhub2RlLCBlcnJvcnMpO1xuICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW50VmVjdG9yUnVsZXMobm9kZSkge1xuICAgICAgICBsZXQgZXJyb3JzID0gW107XG4gICAgICAgIGlmIChsaW50VmVjdG9ycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY2hlY2tGaWxscyhub2RlLCBlcnJvcnMpO1xuICAgICAgICAgICAgY2hlY2tTdHJva2VzKG5vZGUsIGVycm9ycyk7XG4gICAgICAgICAgICBjaGVja0VmZmVjdHMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJyb3JzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsaW50U2hhcGVSdWxlcyhub2RlKSB7XG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICAgICAgY2hlY2tGaWxscyhub2RlLCBlcnJvcnMpO1xuICAgICAgICBjaGVja1N0cm9rZXMobm9kZSwgZXJyb3JzKTtcbiAgICAgICAgY2hlY2tFZmZlY3RzKG5vZGUsIGVycm9ycyk7XG4gICAgICAgIHJldHVybiBlcnJvcnM7XG4gICAgfVxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFcnJvck9iamVjdChub2RlLCB0eXBlLCBtZXNzYWdlLCB2YWx1ZSkge1xuICAgIGxldCBlcnJvciA9IHtcbiAgICAgICAgbWVzc2FnZTogXCJcIixcbiAgICAgICAgdHlwZTogXCJcIixcbiAgICAgICAgbm9kZTogXCJcIixcbiAgICAgICAgdmFsdWU6IFwiXCJcbiAgICB9O1xuICAgIGVycm9yLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGVycm9yLnR5cGUgPSB0eXBlO1xuICAgIGVycm9yLm5vZGUgPSBub2RlO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVycm9yLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVGaWxsKGZpbGxzKSB7XG4gICAgbGV0IGZpbGxWYWx1ZXMgPSBbXTtcbiAgICBmaWxscy5mb3JFYWNoKGZpbGwgPT4ge1xuICAgICAgICBpZiAoZmlsbC50eXBlID09PSBcIlNPTElEXCIpIHtcbiAgICAgICAgICAgIGxldCByZ2JPYmogPSBjb252ZXJ0Q29sb3IoZmlsbC5jb2xvcik7XG4gICAgICAgICAgICBmaWxsVmFsdWVzLnB1c2goUkdCVG9IZXgocmdiT2JqW1wiclwiXSwgcmdiT2JqW1wiZ1wiXSwgcmdiT2JqW1wiYlwiXSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpbGwudHlwZSA9PT0gXCJJTUFHRVwiKSB7XG4gICAgICAgICAgICBmaWxsVmFsdWVzLnB1c2goXCJJbWFnZSAtIFwiICsgZmlsbC5pbWFnZUhhc2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZ3JhZGllbnRWYWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIGZpbGwuZ3JhZGllbnRTdG9wcy5mb3JFYWNoKGdyYWRpZW50U3RvcHMgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBncmFkaWVudENvbG9yT2JqZWN0ID0gY29udmVydENvbG9yKGdyYWRpZW50U3RvcHMuY29sb3IpO1xuICAgICAgICAgICAgICAgIGdyYWRpZW50VmFsdWVzLnB1c2goUkdCVG9IZXgoZ3JhZGllbnRDb2xvck9iamVjdFtcInJcIl0sIGdyYWRpZW50Q29sb3JPYmplY3RbXCJnXCJdLCBncmFkaWVudENvbG9yT2JqZWN0W1wiYlwiXSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgZ3JhZGllbnRWYWx1ZVN0cmluZyA9IGdyYWRpZW50VmFsdWVzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBmaWxsVmFsdWVzLnB1c2goYCR7ZmlsbC50eXBlfSAke2dyYWRpZW50VmFsdWVTdHJpbmd9YCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsbFZhbHVlc1swXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JhZGl1cyhub2RlLCBlcnJvcnMsIHJhZGl1c1ZhbHVlcykge1xuICAgIGxldCBjb3JuZXJUeXBlID0gbm9kZS5jb3JuZXJSYWRpdXM7XG4gICAgaWYgKHR5cGVvZiBjb3JuZXJUeXBlICE9PSBcInN5bWJvbFwiKSB7XG4gICAgICAgIGlmIChjb3JuZXJUeXBlID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb3JuZXJUeXBlID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgIGlmIChyYWRpdXNWYWx1ZXMuaW5kZXhPZihub2RlLnRvcExlZnRSYWRpdXMpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9ycy5wdXNoKGNyZWF0ZUVycm9yT2JqZWN0KG5vZGUsIFwicmFkaXVzXCIsIFwiSW5jb3JyZWN0IFRvcCBMZWZ0IFJhZGl1c1wiLCBub2RlLnRvcFJpZ2h0UmFkaXVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmFkaXVzVmFsdWVzLmluZGV4T2Yobm9kZS50b3BSaWdodFJhZGl1cykgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJyYWRpdXNcIiwgXCJJbmNvcnJlY3QgdG9wIHJpZ2h0IHJhZGl1c1wiLCBub2RlLnRvcFJpZ2h0UmFkaXVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmFkaXVzVmFsdWVzLmluZGV4T2Yobm9kZS5ib3R0b21MZWZ0UmFkaXVzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMucHVzaChjcmVhdGVFcnJvck9iamVjdChub2RlLCBcInJhZGl1c1wiLCBcIkluY29ycmVjdCBib3R0b20gbGVmdCByYWRpdXNcIiwgbm9kZS5ib3R0b21MZWZ0UmFkaXVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmFkaXVzVmFsdWVzLmluZGV4T2Yobm9kZS5ib3R0b21SaWdodFJhZGl1cykgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJyYWRpdXNcIiwgXCJJbmNvcnJlY3QgYm90dG9tIHJpZ2h0IHJhZGl1c1wiLCBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChyYWRpdXNWYWx1ZXMuaW5kZXhPZihub2RlLmNvcm5lclJhZGl1cykgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJyYWRpdXNcIiwgXCJJbmNvcnJlY3QgYm9yZGVyIHJhZGl1c1wiLCBub2RlLmNvcm5lclJhZGl1cykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbUNoZWNrVGV4dEZpbGxzKG5vZGUsIGVycm9ycykge1xuICAgIGNvbnN0IGZpbGxzVG9DaGVjayA9IFtcbiAgICAgICAgXCI0YjkzZDQwZjYxYmUxNWUyNTVlODc5NDhhNzE1NTIxYzNhZTk1N2U2XCJcbiAgICBdO1xuICAgIGxldCBub2RlRmlsbFN0eWxlID0gbm9kZS5maWxsU3R5bGVJZDtcbiAgICBpZiAodHlwZW9mIG5vZGVGaWxsU3R5bGUgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ycy5wdXNoKGNyZWF0ZUVycm9yT2JqZWN0KG5vZGUsIFwiZmlsbFwiLCBcIk1peGluZyB0d28gc3R5bGVzIHRvZ2V0aGVyXCIsIFwiTXVsdGlwbGUgU3R5bGVzXCIpKTtcbiAgICB9XG4gICAgbm9kZUZpbGxTdHlsZSA9IG5vZGVGaWxsU3R5bGUucmVwbGFjZShcIlM6XCIsIFwiXCIpO1xuICAgIG5vZGVGaWxsU3R5bGUgPSBub2RlRmlsbFN0eWxlLnNwbGl0KFwiLFwiKVswXTtcbiAgICBpZiAobm9kZUZpbGxTdHlsZSAhPT0gXCJcIikge1xuICAgICAgICBpZiAoZmlsbHNUb0NoZWNrLmluY2x1ZGVzKG5vZGVGaWxsU3R5bGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJmaWxsXCIsIFwiSW5jb3JyZWN0IHRleHQgY29sb3IgdXNlXCIsIFwiVXNpbmcgYSBiYWNrZ3JvdW5kIGNvbG9yIG9uIGEgdGV4dCBsYXllclwiKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNoZWNrRmlsbHMobm9kZSwgZXJyb3JzKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY2hlY2tFZmZlY3RzKG5vZGUsIGVycm9ycykge1xuICAgIGlmIChub2RlLmVmZmVjdHMubGVuZ3RoICYmIG5vZGUudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAobm9kZS5lZmZlY3RTdHlsZUlkID09PSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCBlZmZlY3RzQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIG5vZGUuZWZmZWN0cy5mb3JFYWNoKGVmZmVjdCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGVmZmVjdHNPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0WDogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0WTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiXCJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGVmZmVjdHNPYmplY3QucmFkaXVzID0gZWZmZWN0LnJhZGl1cztcbiAgICAgICAgICAgICAgICBpZiAoZWZmZWN0LnR5cGUgPT09IFwiRFJPUF9TSEFET1dcIikge1xuICAgICAgICAgICAgICAgICAgICBlZmZlY3RzT2JqZWN0LnR5cGUgPSBcIkRyb3AgU2hhZG93XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVmZmVjdC50eXBlID09PSBcIklOTkVSX1NIQURPV1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdHNPYmplY3QudHlwZSA9IFwiSW5uZXIgU2hhZG93XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVmZmVjdC50eXBlID09PSBcIkxBWUVSX0JMVVJcIikge1xuICAgICAgICAgICAgICAgICAgICBlZmZlY3RzT2JqZWN0LnR5cGUgPSBcIkxheWVyIEJsdXJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdHNPYmplY3QudHlwZSA9IFwiQmFja2dyb3VuZCBCbHVyXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlZmZlY3QuY29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVmZmVjdHNGaWxsID0gY29udmVydENvbG9yKGVmZmVjdC5jb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdHNPYmplY3QuZmlsbCA9IFJHQlRvSGV4KGVmZmVjdHNGaWxsW1wiclwiXSwgZWZmZWN0c0ZpbGxbXCJnXCJdLCBlZmZlY3RzRmlsbFtcImJcIl0pO1xuICAgICAgICAgICAgICAgICAgICBlZmZlY3RzT2JqZWN0Lm9mZnNldFggPSBlZmZlY3Qub2Zmc2V0Lng7XG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdHNPYmplY3Qub2Zmc2V0WSA9IGVmZmVjdC5vZmZzZXQueTtcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0c09iamVjdC52YWx1ZSA9IGAke2VmZmVjdHNPYmplY3QudHlwZX0gJHtlZmZlY3RzT2JqZWN0LmZpbGx9ICR7ZWZmZWN0c09iamVjdC5yYWRpdXN9cHggWDogJHtlZmZlY3RzT2JqZWN0Lm9mZnNldFh9LCBZOiAke2VmZmVjdHNPYmplY3Qub2Zmc2V0WX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0c09iamVjdC52YWx1ZSA9IGAke2VmZmVjdHNPYmplY3QudHlwZX0gJHtlZmZlY3RzT2JqZWN0LnJhZGl1c31weGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVmZmVjdHNBcnJheS51bnNoaWZ0KGVmZmVjdHNPYmplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsZXQgY3VycmVudFN0eWxlID0gZWZmZWN0c0FycmF5WzBdLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9ycy5wdXNoKGNyZWF0ZUVycm9yT2JqZWN0KG5vZGUsIFwiZWZmZWN0c1wiLCBcIk1pc3NpbmcgZWZmZWN0cyBzdHlsZVwiLCBjdXJyZW50U3R5bGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ZpbGxzKG5vZGUsIGVycm9ycykge1xuICAgIGlmICgobm9kZS5maWxscy5sZW5ndGggJiYgbm9kZS52aXNpYmxlID09PSB0cnVlKSB8fFxuICAgICAgICB0eXBlb2Ygbm9kZS5maWxscyA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICBsZXQgbm9kZUZpbGxzID0gbm9kZS5maWxscztcbiAgICAgICAgbGV0IGZpbGxTdHlsZUlkID0gbm9kZS5maWxsU3R5bGVJZDtcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlRmlsbHMgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMucHVzaChjcmVhdGVFcnJvck9iamVjdChub2RlLCBcImZpbGxcIiwgXCJNaXNzaW5nIGZpbGwgc3R5bGVcIiwgXCJNaXhlZCB2YWx1ZXNcIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZmlsbFN0eWxlSWQgPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcnMucHVzaChjcmVhdGVFcnJvck9iamVjdChub2RlLCBcImZpbGxcIiwgXCJNaXNzaW5nIGZpbGwgc3R5bGVcIiwgXCJNaXhlZCB2YWx1ZXNcIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLmZpbGxTdHlsZUlkID09PSBcIlwiICYmXG4gICAgICAgICAgICBub2RlLmZpbGxzWzBdLnR5cGUgIT09IFwiSU1BR0VcIiAmJlxuICAgICAgICAgICAgbm9kZS5maWxsc1swXS52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJmaWxsXCIsIFwiTWlzc2luZyBmaWxsIHN0eWxlXCIsIGRldGVybWluZUZpbGwobm9kZS5maWxscykpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1N0cm9rZXMobm9kZSwgZXJyb3JzKSB7XG4gICAgaWYgKG5vZGUuc3Ryb2tlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5vZGUuc3Ryb2tlU3R5bGVJZCA9PT0gXCJcIiAmJiBub2RlLnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGxldCBzdHJva2VPYmplY3QgPSB7XG4gICAgICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiBcIlwiLFxuICAgICAgICAgICAgICAgIHN0cm9rZUFsaWduOiBcIlwiLFxuICAgICAgICAgICAgICAgIHN0cm9rZUZpbGxzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN0cm9rZU9iamVjdC5zdHJva2VXZWlnaHQgPSBub2RlLnN0cm9rZVdlaWdodDtcbiAgICAgICAgICAgIHN0cm9rZU9iamVjdC5zdHJva2VBbGlnbiA9IG5vZGUuc3Ryb2tlQWxpZ247XG4gICAgICAgICAgICBzdHJva2VPYmplY3Quc3Ryb2tlRmlsbHMgPSBkZXRlcm1pbmVGaWxsKG5vZGUuc3Ryb2tlcyk7XG4gICAgICAgICAgICBsZXQgY3VycmVudFN0eWxlID0gYCR7c3Ryb2tlT2JqZWN0LnN0cm9rZUZpbGxzfSAvICR7c3Ryb2tlT2JqZWN0LnN0cm9rZVdlaWdodH0gLyAke3N0cm9rZU9iamVjdC5zdHJva2VBbGlnbn1gO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9ycy5wdXNoKGNyZWF0ZUVycm9yT2JqZWN0KG5vZGUsIFwic3Ryb2tlXCIsIFwiTWlzc2luZyBzdHJva2Ugc3R5bGVcIiwgY3VycmVudFN0eWxlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY2hlY2tUeXBlKG5vZGUsIGVycm9ycykge1xuICAgIGlmIChub2RlLnRleHRTdHlsZUlkID09PSBcIlwiICYmIG5vZGUudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICBsZXQgdGV4dE9iamVjdCA9IHtcbiAgICAgICAgICAgIGZvbnQ6IFwiXCIsXG4gICAgICAgICAgICBmb250U3R5bGU6IFwiXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogXCJcIixcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IHt9XG4gICAgICAgIH07XG4gICAgICAgIGxldCBmb250U3R5bGUgPSBub2RlLmZvbnROYW1lO1xuICAgICAgICBsZXQgZm9udFNpemUgPSBub2RlLmZvbnROYW1lO1xuICAgICAgICBpZiAodHlwZW9mIGZvbnRTaXplID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJ0ZXh0XCIsIFwiTWlzc2luZyB0ZXh0IHN0eWxlXCIsIFwiTWl4ZWQgc2l6ZXMgb3IgZmFtaWxpZXNcIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZm9udFN0eWxlID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JzLnB1c2goY3JlYXRlRXJyb3JPYmplY3Qobm9kZSwgXCJ0ZXh0XCIsIFwiTWlzc2luZyB0ZXh0IHN0eWxlXCIsIFwiTWl4ZWQgc2l6ZXMgb3IgZmFtaWxpZXNcIikpO1xuICAgICAgICB9XG4gICAgICAgIHRleHRPYmplY3QuZm9udCA9IG5vZGUuZm9udE5hbWUuZmFtaWx5O1xuICAgICAgICB0ZXh0T2JqZWN0LmZvbnRTdHlsZSA9IG5vZGUuZm9udE5hbWUuc3R5bGU7XG4gICAgICAgIHRleHRPYmplY3QuZm9udFNpemUgPSBub2RlLmZvbnRTaXplO1xuICAgICAgICBpZiAobm9kZS5saW5lSGVpZ2h0LnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRleHRPYmplY3QubGluZUhlaWdodCA9IG5vZGUubGluZUhlaWdodC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRleHRPYmplY3QubGluZUhlaWdodCA9IFwiQXV0b1wiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50U3R5bGUgPSBgJHt0ZXh0T2JqZWN0LmZvbnR9ICR7dGV4dE9iamVjdC5mb250U3R5bGV9IC8gJHt0ZXh0T2JqZWN0LmZvbnRTaXplfSAoJHt0ZXh0T2JqZWN0LmxpbmVIZWlnaHR9IGxpbmUtaGVpZ2h0KWA7XG4gICAgICAgIHJldHVybiBlcnJvcnMucHVzaChjcmVhdGVFcnJvck9iamVjdChub2RlLCBcInRleHRcIiwgXCJNaXNzaW5nIHRleHQgc3R5bGVcIiwgY3VycmVudFN0eWxlKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuY29uc3QgY29udmVydENvbG9yID0gY29sb3IgPT4ge1xuICAgIGNvbnN0IGNvbG9yT2JqID0gY29sb3I7XG4gICAgY29uc3QgZmlnbWFDb2xvciA9IHt9O1xuICAgIE9iamVjdC5lbnRyaWVzKGNvbG9yT2JqKS5mb3JFYWNoKGNmID0+IHtcbiAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gY2Y7XG4gICAgICAgIGlmIChbXCJyXCIsIFwiZ1wiLCBcImJcIl0uaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgZmlnbWFDb2xvcltrZXldID0gKDI1NSAqIHZhbHVlKS50b0ZpeGVkKDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09IFwiYVwiKSB7XG4gICAgICAgICAgICBmaWdtYUNvbG9yW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWdtYUNvbG9yO1xufTtcbmZ1bmN0aW9uIFJHQlRvSGV4KHIsIGcsIGIpIHtcbiAgICByID0gTnVtYmVyKHIpLnRvU3RyaW5nKDE2KTtcbiAgICBnID0gTnVtYmVyKGcpLnRvU3RyaW5nKDE2KTtcbiAgICBiID0gTnVtYmVyKGIpLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAoci5sZW5ndGggPT0gMSlcbiAgICAgICAgciA9IFwiMFwiICsgcjtcbiAgICBpZiAoZy5sZW5ndGggPT0gMSlcbiAgICAgICAgZyA9IFwiMFwiICsgZztcbiAgICBpZiAoYi5sZW5ndGggPT0gMSlcbiAgICAgICAgYiA9IFwiMFwiICsgYjtcbiAgICByZXR1cm4gXCIjXCIgKyByICsgZyArIGI7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9