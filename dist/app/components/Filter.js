import * as React from "react";
import BulkErrorList from "./BulkErrorList";
import TotalErrorCount from "./TotalErrorCount";
import { useState } from "react";
function Filter(props) {
    const [colorCheckbox, setIsColorChecked] = useState(false);
    const [strokeCheckbox, setIsStrokeChecked] = useState(false);
    const [typeCheckbox, setIsTypeChecked] = useState(false);
    const [effectsCheckbox, setIsEffectsChecked] = useState(false);
    const [radiusCheckbox, setIsRadiusChecked] = useState(false);
    const [allCheckbox, setIsAllChecked] = useState(false);
    const handleChangeColor = () => {
        setIsColorChecked(!colorCheckbox);
        setIsAllChecked(false);
    };
    const handleChangeStroke = () => {
        setIsStrokeChecked(!strokeCheckbox);
        setIsAllChecked(false);
    };
    const handleChangeType = () => {
        setIsTypeChecked(!typeCheckbox);
        setIsAllChecked(false);
    };
    const handleChangeEffects = () => {
        setIsEffectsChecked(!effectsCheckbox);
        setIsAllChecked(false);
    };
    const handleChangeRadius = () => {
        setIsRadiusChecked(!radiusCheckbox);
        setIsAllChecked(false);
    };
    const handleChangeAll = () => {
        setIsAllChecked(!allCheckbox);
        setIsColorChecked(false);
        setIsStrokeChecked(false);
        setIsTypeChecked(false);
        setIsEffectsChecked(false);
        setIsRadiusChecked(false);
    };
    let filteredErrorArray = props.errorArray.filter(item => item.errors.length >= 1);
    filteredErrorArray.forEach(item => {
        if (props.ignoredErrorArray.some(x => x.node.id === item.id)) {
            props.ignoredErrorArray.forEach(ignoredError => {
                if (ignoredError.node.id === item.id) {
                    for (let i = 0; i < item.errors.length; i++) {
                        if (item.errors[i].value === ignoredError.value) {
                            item.errors.splice(i, 1);
                            i--;
                        }
                    }
                }
            });
        }
    });
    let bulkErrorList = [];
    let bulkErrorListToPass = [];
    filteredErrorArray.forEach(item => {
        let nodeErrors = item.errors;
        nodeErrors.forEach(error => {
            if (bulkErrorList.some(e => e.value === error.value)) {
                let duplicateError = bulkErrorList.find(e => e.value === error.value);
                let nodesThatShareErrors = duplicateError.nodes;
                nodesThatShareErrors.push(error.node.id);
                duplicateError.nodes = nodesThatShareErrors;
                duplicateError.count = duplicateError.nodes.length;
            }
            else {
                error.nodes = [error.node.id];
                error.count = 0;
                bulkErrorList.push(error);
            }
        });
    });
    bulkErrorList.sort((a, b) => b.count - a.count);
    if (colorCheckbox == true) {
        for (let j = 0; j < bulkErrorList.length; j++) {
            if (bulkErrorList[j].type == "fill") {
                bulkErrorListToPass.push(bulkErrorList[j]);
            }
        }
    }
    if (strokeCheckbox == true) {
        for (let j = 0; j < bulkErrorList.length; j++) {
            if (bulkErrorList[j].type == "stroke") {
                bulkErrorListToPass.push(bulkErrorList[j]);
            }
        }
    }
    if (typeCheckbox == true) {
        for (let j = 0; j < bulkErrorList.length; j++) {
            if (bulkErrorList[j].type == "text") {
                bulkErrorListToPass.push(bulkErrorList[j]);
            }
        }
    }
    if (effectsCheckbox == true) {
        for (let j = 0; j < bulkErrorList.length; j++) {
            if (bulkErrorList[j].type == "effects") {
                bulkErrorListToPass.push(bulkErrorList[j]);
            }
        }
    }
    if (radiusCheckbox == true) {
        for (let j = 0; j < bulkErrorList.length; j++) {
            if (bulkErrorList[j].type == "radius") {
                bulkErrorListToPass.push(bulkErrorList[j]);
            }
        }
    }
    if (allCheckbox == true) {
        bulkErrorListToPass = bulkErrorList;
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: "flex-container filter" },
            React.createElement("div", { className: "instructions" }),
            React.createElement("label", { className: "all" },
                React.createElement("input", { type: "checkbox", checked: allCheckbox, onChange: handleChangeAll, name: "tag", value: "all" }),
                " ",
                React.createElement("span", { className: "tag" }, "All")),
            React.createElement("div", { id: "filter-divider" }, "|"),
            React.createElement("label", { className: "fill" },
                React.createElement("input", { type: "checkbox", checked: colorCheckbox, onChange: handleChangeColor, name: "tag", value: "fill" }),
                React.createElement("span", { className: "tag" }, "Fill")),
            React.createElement("label", { className: "stroke" },
                React.createElement("input", { type: "checkbox", checked: strokeCheckbox, onChange: handleChangeStroke, name: "tag", value: "stroke" }),
                React.createElement("span", { className: "tag" }, "Stroke")),
            React.createElement("label", { className: "typography" },
                React.createElement("input", { type: "checkbox", checked: typeCheckbox, onChange: handleChangeType, name: "tag", value: "typography" }),
                React.createElement("span", { className: "tag" }, "Typography")),
            React.createElement("label", { className: "effects" },
                React.createElement("input", { type: "checkbox", checked: effectsCheckbox, onChange: handleChangeEffects, name: "tag", value: "effects" }),
                React.createElement("span", { className: "tag" }, "Effects")),
            React.createElement("label", { className: "radius" },
                React.createElement("input", { type: "checkbox", checked: radiusCheckbox, onChange: handleChangeRadius, name: "tag", value: "radius" }),
                React.createElement("span", { className: "tag" }, "Radius"))),
        React.createElement("div", { className: "bulk-errors-list" },
            React.createElement(BulkErrorList, { errorArray: bulkErrorListToPass, ignoredErrorArray: props.ignoredErrorArray, onIgnoredUpdate: props.updateIgnoredErrors, onIgnoreAll: props.ignoreAll, ignoredErrors: props.ignoredErrorArray, onClick: props.updateVisibility, onSelectedListUpdate: props.updateSelectedList })),
        React.createElement("div", { className: "footer sticky-footer" },
            React.createElement(TotalErrorCount, { errorArray: filteredErrorArray }))));
}
export default Filter;
