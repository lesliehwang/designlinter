import * as React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import ListItem from "./ListItem";
import TotalErrorCount from "./TotalErrorCount";
function NodeList(props) {
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
    const handleNodeClick = id => {
        let activeId = props.errorArray.find(e => e.id === id);
        if (activeId.errors.length) {
            parent.postMessage({ pluginMessage: { type: "fetch-layer-data", id: id } }, "*");
            props.onErrorUpdate(activeId);
            if (props.visibility === true) {
                props.onVisibleUpdate(false);
            }
            else {
                props.onVisibleUpdate(true);
            }
        }
        props.onSelectedListUpdate(id);
    };
    const handleOpenFirstError = () => {
        const lastItem = filteredErrorArray[filteredErrorArray.length - 1];
        handleNodeClick(lastItem.id);
    };
    if (props.nodeArray.length) {
        let nodes = props.nodeArray;
        const listItems = nodes.map(node => (React.createElement(ListItem, { ignoredErrorArray: props.ignoredErrorArray, activeNodeIds: props.activeNodeIds, onClick: handleNodeClick, selectedListItems: props.selectedListItems, errorArray: filteredErrorArray, key: node.id, node: node })));
        const variants = {
            initial: { opacity: 1, y: 10, scale: 1 },
            enter: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -10, scale: 0.8 }
        };
        return (React.createElement(motion.div, { className: "page", key: "node-list", variants: variants, initial: "initial", animate: "enter", exit: "exit" },
            React.createElement("ul", { className: "list" }, listItems),
            React.createElement("div", { className: "footer" },
                React.createElement(TotalErrorCount, { errorArray: filteredErrorArray }),
                React.createElement("div", { className: "actions-row" },
                    React.createElement("button", { className: "button button--primary button--flex", disabled: filteredErrorArray.length === 0, onClick: event => {
                            event.stopPropagation();
                            handleOpenFirstError();
                        } }, "Jump to next error \u2192")))));
    }
    else {
        return (React.createElement(React.Fragment, null,
            React.createElement("ul", { className: "list" }),
            React.createElement(TotalErrorCount, { errorArray: filteredErrorArray })));
    }
}
export default React.memo(NodeList);
