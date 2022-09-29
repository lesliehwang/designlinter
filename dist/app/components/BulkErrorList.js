import * as React from "react";
import BulkErrorListItem from "./BulkErrorListItem";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
function BulkErrorList(props) {
    let test = props.errorArray;
    function handleIgnoreChange(error) {
        props.onIgnoredUpdate(error);
    }
    function handleSelectAll(error) {
        parent.postMessage({
            pluginMessage: {
                type: "select-multiple-layers",
                nodeArray: error.nodes
            }
        }, "*");
    }
    function handleSelect(error) {
        parent.postMessage({
            pluginMessage: {
                type: "fetch-layer-data",
                id: error.node.id
            }
        }, "*");
    }
    function handleIgnoreAll(error) {
        let errorsToBeIgnored = [];
        test.forEach(item => {
            if (item.value === error.value) {
                if (item.type === error.type) {
                    errorsToBeIgnored.push(item);
                }
            }
        });
        if (errorsToBeIgnored.length) {
            props.onIgnoreAll(errorsToBeIgnored);
        }
    }
    const errorListItems = test.map((error, index) => (React.createElement(BulkErrorListItem, { error: error, index: index, key: index, handleIgnoreChange: handleIgnoreChange, handleSelectAll: handleSelectAll, handleSelect: handleSelect, handleIgnoreAll: handleIgnoreAll })));
    return (React.createElement("div", null,
        React.createElement("div", { className: "panel-body panel-body-errors" }, test.length ? (React.createElement("ul", { className: "errors-list" },
            React.createElement(AnimatePresence, null, errorListItems))) : (React.createElement("div", { className: "success-message" },
            React.createElement("div", { className: "success-shape" },
                React.createElement("img", { className: "success-icon", src: require("../assets/smile.svg") })),
            "All errors fixed in the selection")))));
}
export default BulkErrorList;
