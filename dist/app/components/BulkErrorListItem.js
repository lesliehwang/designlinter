import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion/dist/framer-motion";
function BulkErrorListItem(props) {
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
    function handleSelect(error) {
        props.handleSelect(error);
    }
    function handleIgnoreAll(error) {
        props.handleIgnoreAll(error);
    }
    const variants = {
        initial: { opacity: 1, y: 10, scale: 1 },
        enter: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.8 }
    };
    return (React.createElement(motion.li, { className: "error-list-item", ref: ref, onClick: showMenu, positionTransition: true, key: error.node.id + props.index, variants: variants, initial: "initial", animate: "enter", exit: "exit" },
        React.createElement("div", { className: "flex-row" },
            React.createElement("span", { className: "error-type" },
                React.createElement("img", { src: require("../assets/error-type/" +
                        error.type.toLowerCase() +
                        ".svg") })),
            React.createElement("span", { className: "error-description" },
                error.nodes.length > 1 ? (React.createElement("div", { className: "error-description__message" },
                    error.message,
                    " (",
                    error.count,
                    ")")) : (React.createElement("div", { className: "error-description__message" }, error.message)),
                error.value ? (React.createElement("div", { className: "current-value" }, error.value)) : null),
            React.createElement("span", { className: "context-icon" },
                React.createElement("div", { className: "menu", ref: ref },
                    React.createElement("div", { className: "menu-trigger", onClick: showMenu },
                        React.createElement("img", { src: require("../assets/context.svg") })))),
            error.nodes.length > 1 ? (React.createElement("ul", { className: "menu-items select-menu__list " +
                    (menuState ? "select-menu__list--active" : "") },
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-1", onClick: event => {
                        event.stopPropagation();
                        handleSelectAll(error);
                        hideMenu();
                    } },
                    "Select All (",
                    error.count,
                    ")"),
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-3", onClick: event => {
                        event.stopPropagation();
                        handleIgnoreAll(error);
                        hideMenu();
                    } }, "Ignore All"))) : (React.createElement("ul", { className: "menu-items select-menu__list " +
                    (menuState ? "select-menu__list--active" : "") },
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-1", onClick: event => {
                        event.stopPropagation();
                        handleSelect(error);
                        hideMenu();
                    } }, "Select"),
                React.createElement("li", { className: "select-menu__list-item", key: "list-item-2", onClick: event => {
                        event.stopPropagation();
                        handleIgnoreChange(error);
                        hideMenu();
                    } }, "Ignore"))))));
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
export default BulkErrorListItem;
