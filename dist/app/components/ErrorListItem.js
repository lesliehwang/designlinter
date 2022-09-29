import * as React from "react";
import { useState, useRef, useEffect } from "react";
function ErrorListItem(props) {
    const ref = useRef();
    const [menuState, setMenuState] = useState(false);
    let error = props.error;
    useOnClickOutside(ref, () => hideMenu());
    const showMenu = () => {
        setMenuState(true);
    };
    const hideMenu = () => {
        setMenuState(false);
    };
    function handleIgnoreChange(error) {
        props.handleIgnoreChange(error);
    }
    function handleSelectAll(error) {
        props.handleSelectAll(error);
    }
    function handleIgnoreAll(error) {
        props.handleIgnoreAll(error);
    }
    return (React.createElement("li", { className: "error-list-item", ref: ref, onClick: showMenu },
        React.createElement("div", { className: "flex-row" },
            React.createElement("span", { className: "error-type" },
                React.createElement("img", { src: require("../assets/error-type/" +
                        error.type.toLowerCase() +
                        ".svg") })),
            React.createElement("span", { className: "error-description" },
                React.createElement("div", { className: "error-description__message" }, error.message),
                error.value ? (React.createElement("div", { className: "current-value" }, error.value)) : null),
            React.createElement("span", { className: "context-icon" },
                React.createElement("div", { className: "menu", ref: ref },
                    React.createElement("div", { className: "menu-trigger", onClick: showMenu },
                        React.createElement("img", { src: require("../assets/context.svg") })))),
            props.errorCount > 1 ? (React.createElement("ul", { className: "menu-items select-menu__list " +
                    (menuState ? "select-menu__list--active" : "") },
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-1", onClick: event => {
                        event.stopPropagation();
                        handleSelectAll(error);
                        hideMenu();
                    } },
                    "Select All (",
                    props.errorCount,
                    ")"),
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-2", onClick: event => {
                        event.stopPropagation();
                        handleIgnoreChange(error);
                        hideMenu();
                    } }, "Ignore"),
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-3", onClick: event => {
                        event.stopPropagation();
                        handleIgnoreAll(error);
                        hideMenu();
                    } }, "Ignore All"))) : (React.createElement("ul", { className: "menu-items select-menu__list " +
                    (menuState ? "select-menu__list--active" : "") },
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-2", onClick: event => {
                        event.stopPropagation();
                        handleIgnoreChange(error);
                        hideMenu();
                    } }, "Ignore"),
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-3", onClick: event => {
                        event.stopPropagation();
                        handleIgnoreAll(error);
                        hideMenu();
                    } }, "Ignore All"))))));
}
function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = event => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}
export default ErrorListItem;
