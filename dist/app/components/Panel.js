import * as React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import ErrorList from "./ErrorList";
import PanelHeader from "./PanelHeader";
import Preloader from "./Preloader";
import "../styles/panel.css";
function Panel(props) {
    const isVisible = props.visibility;
    const node = props.node;
    let filteredErrorArray = props.errorArray.filter(item => item.errors.length >= 1);
    filteredErrorArray.forEach(item => {
        if (props.ignoredErrors.some(x => x.node.id === item.id)) {
            props.ignoredErrors.forEach(ignoredError => {
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
    let activeId = props.errorArray.find(e => e.id === node.id);
    let errors = [];
    if (activeId !== undefined) {
        errors = activeId.errors;
    }
    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "100%" }
    };
    function handlePrevNavigation() {
        let currentIndex = filteredErrorArray.findIndex(item => item.id === activeId.id);
        if (filteredErrorArray[currentIndex + 1] !== undefined) {
            activeId = filteredErrorArray[currentIndex + 1];
        }
        else if (currentIndex !== 0) {
            activeId = filteredErrorArray[0];
        }
        else {
            activeId = filteredErrorArray[currentIndex - 1];
        }
        props.onSelectedListUpdate(activeId.id);
        parent.postMessage({ pluginMessage: { type: "fetch-layer-data", id: activeId.id } }, "*");
    }
    function handleNextNavigation() {
        let currentIndex = filteredErrorArray.findIndex(item => item.id === activeId.id);
        let lastItem = currentIndex + filteredErrorArray.length - 1;
        if (filteredErrorArray[currentIndex - 1] !== undefined) {
            activeId = filteredErrorArray[currentIndex - 1];
        }
        else if (filteredErrorArray.length === 1) {
            activeId = filteredErrorArray[0];
        }
        else {
            activeId = filteredErrorArray[lastItem];
        }
        props.onSelectedListUpdate(activeId.id);
        parent.postMessage({ pluginMessage: { type: "fetch-layer-data", id: activeId.id } }, "*");
    }
    function handleChange() {
        props.onClick();
    }
    function handleIgnoreChange(error) {
        props.onIgnoredUpdate(error);
    }
    function handleSelectAll(error) {
        let nodesToBeSelected = [];
        filteredErrorArray.forEach(node => {
            node.errors.forEach(item => {
                if (item.value === error.value) {
                    if (item.type === error.type) {
                        nodesToBeSelected.push(item.node.id);
                    }
                }
            });
        });
        if (nodesToBeSelected.length) {
            parent.postMessage({
                pluginMessage: {
                    type: "select-multiple-layers",
                    nodeArray: nodesToBeSelected
                }
            }, "*");
        }
    }
    function handleIgnoreAll(error) {
        let errorsToBeIgnored = [];
        filteredErrorArray.forEach(node => {
            node.errors.forEach(item => {
                if (item.value === error.value) {
                    if (item.type === error.type) {
                        errorsToBeIgnored.push(item);
                    }
                }
            });
        });
        if (errorsToBeIgnored.length) {
            props.onIgnoreAll(errorsToBeIgnored);
        }
    }
    return (React.createElement(React.Fragment, null,
        activeId !== undefined ? (React.createElement(motion.div, { className: `panel`, animate: isVisible ? "open" : "closed", transition: { duration: 0.3, type: "tween" }, variants: variants },
            React.createElement(PanelHeader, { title: node.name, handleHide: handleChange }),
            React.createElement("div", { className: "panel-body" }, errors.length ? (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "error-label" },
                    "Errors \u2014 ",
                    errors.length),
                React.createElement(ErrorList, { onIgnoredUpdate: handleIgnoreChange, onIgnoreAll: handleIgnoreAll, onSelectAll: handleSelectAll, errors: errors, allErrors: filteredErrorArray }))) : (React.createElement(motion.div, { initial: { opacity: 0, y: 10, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 1, y: -10, scale: 0 }, className: "success-message" },
                React.createElement("div", { className: "success-shape" },
                    React.createElement("img", { className: "success-icon", src: require("../assets/smile.svg") })),
                "All errors fixed in the selection"))),
            React.createElement("div", { className: "panel-footer" },
                React.createElement("button", { onClick: handlePrevNavigation, disabled: filteredErrorArray.length <= 1, className: "button previous button--secondary button--flex" }, "\u2190 Previous"),
                React.createElement("button", { onClick: handleNextNavigation, disabled: filteredErrorArray.length <= 1, className: "button next button--secondary button--flex" }, "Next \u2192")))) : (React.createElement(motion.div, { className: `panel`, animate: isVisible ? "open" : "closed", transition: { duration: 0.3, type: "tween" }, variants: variants },
            React.createElement("div", { className: "name-wrapper" },
                React.createElement(Preloader, null)))),
        isVisible ? (React.createElement("div", { className: "overlay", onClick: handleChange })) : null));
}
export default React.memo(Panel);
