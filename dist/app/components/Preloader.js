import * as React from "react";
import { motion } from "framer-motion/dist/framer-motion";
function Preloader() {
    const loading = (React.createElement("div", { className: "preloader" },
        React.createElement(motion.div, { className: "preloader-row", initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -24 }, transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            } },
            React.createElement(motion.div, { className: "preloader-circle", initial: { scale: 0.8, y: 0, opacity: 1 }, animate: { scale: 1, y: -4, opacity: 0.8 }, transition: {
                    yoyo: Infinity,
                    type: "tween",
                    duration: 0.3,
                    delay: 0,
                    repeatDelay: 0.3
                } }),
            React.createElement(motion.div, { className: "preloader-circle", initial: { scale: 0.8, y: 0, opacity: 1 }, animate: { scale: 1, y: -4, opacity: 0.8 }, transition: {
                    yoyo: Infinity,
                    type: "tween",
                    duration: 0.3,
                    delay: 0.15,
                    repeatDelay: 0.3
                } }),
            React.createElement(motion.div, { className: "preloader-circle", initial: { scale: 0.8, y: 0, opacity: 1 }, animate: { scale: 1, y: -4, opacity: 0.8 }, transition: {
                    yoyo: Infinity,
                    type: "tween",
                    duration: 0.3,
                    delay: 0.3,
                    repeatDelay: 0.3
                } }))));
    return React.createElement(React.Fragment, null, loading);
}
export default Preloader;
