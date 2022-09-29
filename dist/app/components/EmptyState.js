import * as React from "react";
import { motion } from "framer-motion/dist/framer-motion";
function EmptyState(props) {
    const onRunApp = () => {
        props.onHandleRunApp();
    };
    return (React.createElement(motion.div, { className: "empty-state-wrapper", initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 }, transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        } },
        React.createElement("div", { className: "background-wrapper" },
            React.createElement("img", { className: "empty-state-background", src: require("../assets/mesh-background.png") })),
        React.createElement("div", { className: "empty-state" },
            React.createElement("div", { className: "empty-state__image" },
                React.createElement("img", { className: "layer-icon", src: require("../assets/new-logo.svg") })),
            React.createElement("div", { className: "empty-state__title" }, "Select a layer to get started."),
            React.createElement("button", { className: "button button--primary button--full", onClick: onRunApp }, "Run Design Lint"))));
}
export default EmptyState;
