import * as React from "react";
import SettingsPanel from "./SettingsPanel";
function Navigation(props) {
    const [panelVisible, setPanelVisible] = React.useState(false);
    let activePage = props.activePage;
    const layersClick = () => {
        props.onPageSelection("layers");
    };
    const bulkListClick = () => {
        props.onPageSelection("bulk");
    };
    const handleLintRulesChange = boolean => {
        props.updateLintRules(boolean);
    };
    const handlePanelVisible = boolean => {
        setPanelVisible(boolean);
    };
    const handleRefreshSelection = () => {
        props.onRefreshSelection();
    };
    return (React.createElement("div", { key: "nav" },
        React.createElement("div", { className: "navigation-wrapper" },
            React.createElement("nav", { className: "nav" },
                React.createElement("div", { className: `nav-item ${activePage === "layers" ? "active" : ""}`, onClick: layersClick }, "Layers"),
                React.createElement("div", { className: `nav-item ${activePage === "bulk" ? "active" : ""}`, onClick: bulkListClick }, "Errors by Category"),
                React.createElement("div", { className: "nav-icon-wrapper" },
                    React.createElement("button", { className: "icon icon--refresh icon--button settings-button", onClick: event => {
                            event.stopPropagation();
                            handleRefreshSelection();
                        } },
                        React.createElement("img", { src: require("../assets/refresh.svg") })),
                    React.createElement("button", { className: "icon icon--adjust icon--button settings-button", onClick: event => {
                            event.stopPropagation();
                            handlePanelVisible(true);
                        } })))),
        React.createElement(SettingsPanel, { panelVisible: panelVisible, onHandlePanelVisible: handlePanelVisible, ignoredErrorArray: props.ignoredErrorArray, borderRadiusValues: props.borderRadiusValues, updateLintRules: handleLintRulesChange, lintVectors: props.lintVectors })));
}
export default Navigation;
