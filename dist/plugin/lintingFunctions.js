export function createErrorObject(node, type, message, value) {
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
export function determineFill(fills) {
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
export function checkRadius(node, errors, radiusValues) {
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
export function customCheckTextFills(node, errors) {
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
export function checkEffects(node, errors) {
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
export function checkFills(node, errors) {
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
export function checkStrokes(node, errors) {
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
export function checkType(node, errors) {
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
