import * as React from "react";
import { useState } from "react";
import Navigation from "./Navigation";
import NodeList from "./NodeList";
import Preloader from "./Preloader";
import EmptyState from "./EmptyState";
import Panel from "./Panel";
import Filter from "./Filter";
import "../styles/figma.ds.css";
import "../styles/ui.css";
import "../styles/empty-state.css";
const App = ({}) => {
    const [errorArray, setErrorArray] = useState([]);
    const [activePage, setActivePage] = useState("page");
    const [ignoredErrorArray, setIgnoreErrorArray] = useState([]);
    const [activeError, setActiveError] = React.useState({});
    const [selectedNode, setSelectedNode] = React.useState({});
    const [isVisible, setIsVisible] = React.useState(false);
    const [nodeArray, setNodeArray] = useState([]);
    const [selectedListItems, setSelectedListItem] = React.useState([]);
    const [activeNodeIds, setActiveNodeIds] = React.useState([]);
    const [borderRadiusValues, setBorderRadiusValues] = useState([
        0,
        2,
        4,
        8,
        16,
        24,
        32
    ]);
    const [lintVectors, setLintVectors] = useState(false);
    const [initialLoad, setInitialLoad] = React.useState(false);
    const [timedLoad, setTimeLoad] = React.useState(false);
    let newWindowFocus = false;
    let counter = 0;
    window.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
            window.parent.postMessage({ pluginMessage: { type: "close" } }, "*");
        }
    });
    const updateSelectedList = id => {
        setSelectedListItem(selectedListItems => {
            selectedListItems.splice(0, selectedListItems.length);
            return selectedListItems.concat(id);
        });
        setActiveNodeIds(activeNodeIds => {
            if (activeNodeIds.includes(id)) {
                if (activeNodeIds.length !== 1) {
                    return activeNodeIds.filter(activeNodeId => activeNodeId !== id);
                }
                else {
                    return activeNodeIds;
                }
            }
            return activeNodeIds.concat(id);
        });
    };
    const updateNavigation = page => {
        setActivePage(page);
        parent.postMessage({
            pluginMessage: {
                type: "update-active-page-in-settings",
                page: page
            }
        }, "*");
    };
    const updateActiveError = error => {
        setActiveError(error);
    };
    const ignoreAll = errors => {
        setIgnoreErrorArray(ignoredErrorArray => [...ignoredErrorArray, ...errors]);
    };
    const updateIgnoredErrors = error => {
        if (ignoredErrorArray.some(e => e.node.id === error.node.id)) {
            if (ignoredErrorArray.some(e => e.value === error.value)) {
                return;
            }
            else {
                setIgnoreErrorArray([error].concat(ignoredErrorArray));
            }
        }
        else {
            setIgnoreErrorArray([error].concat(ignoredErrorArray));
        }
    };
    const updateErrorArray = errors => {
        setErrorArray(errors);
    };
    const updateVisible = val => {
        setIsVisible(val);
    };
    const updateLintRules = boolean => {
        setLintVectors(boolean);
        parent.postMessage({
            pluginMessage: {
                type: "update-lint-rules-from-settings",
                boolean: boolean
            }
        }, "*");
    };
    const onFocus = () => {
        newWindowFocus = true;
        counter = 0;
    };
    const onBlur = () => {
        newWindowFocus = false;
        pollForChanges();
    };
    const onRunApp = React.useCallback(() => {
        parent.postMessage({ pluginMessage: { type: "run-app", lintVectors: lintVectors } }, "*");
    }, []);
    function pollForChanges() {
        if (newWindowFocus === false && counter < 600) {
            let timer = 1500;
            parent.postMessage({ pluginMessage: { type: "update-errors" } }, "*");
            counter++;
            setTimeout(() => {
                pollForChanges();
            }, timer);
        }
    }
    function updateVisibility() {
        if (isVisible === true) {
            setIsVisible(false);
        }
        else {
            setIsVisible(true);
        }
    }
    setTimeout(function () {
        setTimeLoad(true);
    }, 3000);
    React.useEffect(() => {
        if (initialLoad !== false && ignoredErrorArray.length) {
            parent.postMessage({
                pluginMessage: {
                    type: "update-storage",
                    storageArray: ignoredErrorArray
                }
            }, "*");
        }
    }, [ignoredErrorArray]);
    React.useEffect(() => {
        onRunApp();
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        window.onmessage = event => {
            const { type, message, errors, storage } = event.data.pluginMessage;
            if (type === "complete") {
                let nodeObject = JSON.parse(message);
                updateErrorArray(errors);
                parent.postMessage({
                    pluginMessage: {
                        type: "fetch-layer-data",
                        id: nodeObject[0].id,
                        nodeArray: nodeObject
                    }
                }, "*");
                setInitialLoad(true);
            }
            else if (type === "first node") {
                let nodeObject = JSON.parse(message);
                setNodeArray(nodeObject);
                updateErrorArray(errors);
                setSelectedListItem(selectedListItems => {
                    selectedListItems.splice(0, selectedListItems.length);
                    return selectedListItems.concat(nodeObject[0].id);
                });
                setActiveNodeIds(activeNodeIds => {
                    return activeNodeIds.concat(nodeObject[0].id);
                });
                parent.postMessage({
                    pluginMessage: {
                        type: "lint-all",
                        nodes: nodeObject
                    }
                }, "*");
                parent.postMessage({
                    pluginMessage: {
                        type: "fetch-layer-data",
                        id: nodeObject[0].id,
                        nodeArray: nodeObject
                    }
                }, "*");
            }
            else if (type === "fetched storage") {
                let clientStorage = JSON.parse(storage);
                setIgnoreErrorArray(ignoredErrorArray => [
                    ...ignoredErrorArray,
                    ...clientStorage
                ]);
            }
            else if (type === "fetched active page") {
                let clientStorage = JSON.parse(storage);
                setActivePage(clientStorage);
            }
            else if (type === "fetched border radius") {
                let clientStorage = JSON.parse(storage);
                setBorderRadiusValues([...clientStorage]);
            }
            else if (type === "reset storage") {
                let clientStorage = JSON.parse(storage);
                setIgnoreErrorArray([...clientStorage]);
                parent.postMessage({ pluginMessage: { type: "update-errors" } }, "*");
            }
            else if (type === "fetched layer") {
                setSelectedNode(() => JSON.parse(message));
                parent.postMessage({ pluginMessage: { type: "update-errors" } }, "*");
            }
            else if (type === "updated errors") {
                updateErrorArray(errors);
            }
        };
    }, []);
    return (React.createElement("div", { className: "container" },
        React.createElement(Navigation, { onPageSelection: updateNavigation, activePage: activePage, updateLintRules: updateLintRules, ignoredErrorArray: ignoredErrorArray, borderRadiusValues: borderRadiusValues, lintVectors: lintVectors, onRefreshSelection: onRunApp }),
        activeNodeIds.length !== 0 ? (React.createElement("div", null, activePage === "layers" ? (React.createElement(NodeList, { onErrorUpdate: updateActiveError, onVisibleUpdate: updateVisible, onSelectedListUpdate: updateSelectedList, visibility: isVisible, nodeArray: nodeArray, errorArray: errorArray, ignoredErrorArray: ignoredErrorArray, selectedListItems: selectedListItems, activeNodeIds: activeNodeIds })) : (React.createElement(Filter, { errorArray: errorArray, ignoredErrorArray: ignoredErrorArray, onIgnoredUpdate: updateIgnoredErrors, onIgnoreAll: ignoreAll, ignoredErrors: ignoredErrorArray, onClick: updateVisibility, onSelectedListUpdate: updateSelectedList })))) : timedLoad === false ? (React.createElement(Preloader, null)) : (React.createElement(EmptyState, { onHandleRunApp: onRunApp })),
        Object.keys(activeError).length !== 0 && errorArray.length ? (React.createElement(Panel, { visibility: isVisible, node: selectedNode, errorArray: errorArray, onIgnoredUpdate: updateIgnoredErrors, onIgnoreAll: ignoreAll, ignoredErrors: ignoredErrorArray, onClick: updateVisibility, onSelectedListUpdate: updateSelectedList })) : null));
};
export default App;
