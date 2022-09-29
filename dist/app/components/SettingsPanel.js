import * as React from "react";
import { motion } from "framer-motion/dist/framer-motion";
import PanelHeader from "./PanelHeader";
import SettingsForm from "./SettingsForm";
import "../styles/panel.css";
function SettingsPanel(props) {
    const isVisible = props.panelVisible;
    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "100%" }
    };
    function handleHide() {
        props.onHandlePanelVisible(false);
    }
    function handleCheckbox() {
        if (props.lintVectors === false) {
            props.updateLintRules(true);
        }
        else if (props.lintVectors === true) {
            props.updateLintRules(false);
        }
    }
    function clearIgnoredErrors() {
        parent.postMessage({
            pluginMessage: {
                type: "update-storage-from-settings",
                storageArray: []
            }
        }, "*");
        props.onHandlePanelVisible(false);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(motion.div, { className: `panel`, initial: { opacity: 0, x: "100%" }, animate: isVisible ? "open" : "closed", transition: { duration: 0.3, type: "tween" }, variants: variants, key: "settings-panel" },
            React.createElement(PanelHeader, { title: "Settings", handleHide: handleHide }),
            React.createElement("div", { className: "settings-wrapper" },
                React.createElement("div", { className: "settings-row" },
                    React.createElement("h3", { className: "settings-title" }, "Skipping Layers"),
                    React.createElement("div", { className: "settings-label" }, "If you have an illustration or set of layers you want the linter to ignore, lock them in the Figma layer list.")),
                React.createElement(SettingsForm, { borderRadiusValues: props.borderRadiusValues }),
                React.createElement("div", { className: "settings-row" },
                    React.createElement("h3", { className: "settings-title" }, "Lint Vectors (Default Off)"),
                    React.createElement("div", { className: "settings-label" },
                        "Illustrations, vectors, and boolean shapes often throw a lot of errors as they rarely use styles for fills. If you'd like to lint them as well, check the box below.",
                        React.createElement("div", { className: "settings-checkbox-group", onClick: handleCheckbox },
                            React.createElement("input", { name: "vectorsCheckbox", type: "checkbox", checked: props.lintVectors, onChange: handleCheckbox }),
                            React.createElement("label", null, "Lint Vectors and Boolean Shapes")))),
                React.createElement("div", { className: "settings-row" },
                    React.createElement("h3", { className: "settings-title" }, "Ignored errors"),
                    props.ignoredErrorArray.length > 0 ? (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "settings-label" },
                            props.ignoredErrorArray.length,
                            " errors are being ignored in selection."),
                        React.createElement("button", { className: "button button--primary", onClick: clearIgnoredErrors }, "Reset ignored errors"))) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "settings-label" }, "You haven't ignored any errors yet.")))))),
        isVisible ? React.createElement("div", { className: "overlay", onClick: handleHide }) : null));
}
export default React.memo(SettingsPanel);
