import * as React from "react";
import classNames from "classnames";
function ListItem(props) {
    const { onClick } = props;
    const node = props.node;
    let childNodes = null;
    let errorObject = { errors: [] };
    let childErrorsCount = 0;
    let filteredErrorArray = props.errorArray;
    if (filteredErrorArray.some(e => e.id === node.id)) {
        errorObject = filteredErrorArray.find(e => e.id === node.id);
    }
    if (node.children && node.children.length) {
        childErrorsCount = findNestedErrors(node);
        let reversedArray = node.children.slice().reverse();
        childNodes = reversedArray.map(function (childNode) {
            return (React.createElement(ListItem, { ignoredErrorArray: props.ignoredErrorArray, activeNodeIds: props.activeNodeIds, selectedListItems: props.selectedListItems, errorArray: filteredErrorArray, onClick: onClick, key: childNode.id, node: childNode }));
        });
    }
    function findNestedErrors(node) {
        let errorCount = 0;
        node.children.forEach(childNode => {
            if (filteredErrorArray.some(e => e.id === childNode.id)) {
                let childErrorObject = filteredErrorArray.find(e => e.id === childNode.id);
                errorCount = errorCount + childErrorObject.errors.length;
            }
            if (childNode.children) {
                errorCount = errorCount + findNestedErrors(childNode);
            }
        });
        return errorCount;
    }
    return (React.createElement("li", { id: node.id, className: classNames(`list-item`, {
            "list-item--active": props.activeNodeIds.includes(node.id),
            "list-item--selected": props.selectedListItems.includes(node.id)
        }), onClick: event => {
            event.stopPropagation();
            onClick(node.id);
        } },
        React.createElement("div", { className: "list-flex-row" },
            React.createElement("span", { className: "list-arrow" }, childNodes ? (React.createElement("img", { className: "list-arrow-icon", src: require("../assets/caret.svg") })) : null),
            React.createElement("span", { className: "list-icon" },
                React.createElement("img", { src: require("../assets/" + node.type.toLowerCase() + ".svg") })),
            React.createElement("span", { className: "list-name" }, node.name),
            childErrorsCount >= 1 && React.createElement("span", { className: "dot" }),
            errorObject.errors.length >= 1 && (React.createElement("span", { className: "badge" }, errorObject.errors.length))),
        childNodes ? React.createElement("ul", { className: "sub-list" }, childNodes) : null));
}
export default ListItem;
