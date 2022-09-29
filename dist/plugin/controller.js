import { checkRadius, checkEffects, checkFills, checkStrokes, checkType, } from "./lintingFunctions";
figma.showUI(__html__, { width: 360, height: 580 });
let borderRadiusArray = [0, 2, 4, 8, 16, 24, 32];
let originalNodeTree = [];
let lintVectors = false;
let lockedLogo = [];
figma.skipInvisibleInstanceChildren = true;
figma.ui.onmessage = msg => {
    if (msg.type === "close") {
        console.log("msg.type = close");
        for (let i = 0; i < lockedLogo.length; i++) {
            lockedLogo[i].locked = false;
        }
        figma.closePlugin();
    }
    if (msg.type === "fetch-layer-data") {
        console.log("msg.type = fetch-layer-data -> " + msg.id);
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
        console.log("msg.type = update-errors");
        figma.ui.postMessage({
            type: "updated errors",
            errors: lint(originalNodeTree)
        });
    }
    if (msg.type === "update-storage") {
        console.log("msg.type = update-storage");
        let arrayToBeStored = JSON.stringify(msg.storageArray);
        figma.clientStorage.setAsync("storedErrorsToIgnore", arrayToBeStored);
    }
    if (msg.type === "update-storage-from-settings") {
        console.log("msg.type = update-storage-from-settings");
        let arrayToBeStored = JSON.stringify(msg.storageArray);
        figma.clientStorage.setAsync("storedErrorsToIgnore", arrayToBeStored);
        figma.ui.postMessage({
            type: "reset storage",
            storage: arrayToBeStored
        });
        figma.notify("Cleared ignored errors", { timeout: 1000 });
    }
    if (msg.type === "update-active-page-in-settings") {
        console.log("msg.type = update-active-page-in-settings");
        let pageToBeStored = JSON.stringify(msg.page);
        figma.clientStorage.setAsync("storedActivePage", pageToBeStored);
    }
    if (msg.type === "update-lint-rules-from-settings") {
        console.log("msg.type = update-lint-rules-from-settings");
        lintVectors = msg.boolean;
    }
    if (msg.type === "update-border-radius") {
        console.log("msg.type = update-border-radius");
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
        console.log("msg.type = reset-border-radius");
        borderRadiusArray = [0, 2, 4, 8, 16, 24, 32];
        figma.clientStorage.setAsync("storedRadiusValues", []);
        figma.ui.postMessage({
            type: "fetched border radius",
            storage: JSON.stringify(borderRadiusArray)
        });
        figma.notify("Reset border radius value", { timeout: 1000 });
    }
    if (msg.type === "select-multiple-layers") {
        console.log("msg.type = select-multiple-layers");
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
        console.log("msg.type = lint-all");
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
        console.log("msg.type = run-app");
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
        checkFills(node, errors);
        checkRadius(node, errors, borderRadiusArray);
        checkEffects(node, errors);
        checkStrokes(node, errors);
        return errors;
    }
    function lintVariantWrapperRules(node) {
        let errors = [];
        checkFills(node, errors);
        return errors;
    }
    function lintLineRules(node) {
        let errors = [];
        checkStrokes(node, errors);
        checkEffects(node, errors);
        return errors;
    }
    function lintFrameRules(node) {
        let errors = [];
        checkFills(node, errors);
        checkStrokes(node, errors);
        checkRadius(node, errors, borderRadiusArray);
        checkEffects(node, errors);
        return errors;
    }
    function lintTextRules(node) {
        let errors = [];
        checkType(node, errors);
        checkFills(node, errors);
        checkEffects(node, errors);
        checkStrokes(node, errors);
        return errors;
    }
    function lintRectangleRules(node) {
        let errors = [];
        checkFills(node, errors);
        checkRadius(node, errors, borderRadiusArray);
        checkStrokes(node, errors);
        checkEffects(node, errors);
        return errors;
    }
    function lintVectorRules(node) {
        let errors = [];
        if (lintVectors === true) {
            checkFills(node, errors);
            checkStrokes(node, errors);
            checkEffects(node, errors);
        }
        return errors;
    }
    function lintShapeRules(node) {
        let errors = [];
        checkFills(node, errors);
        checkStrokes(node, errors);
        checkEffects(node, errors);
        return errors;
    }
};
