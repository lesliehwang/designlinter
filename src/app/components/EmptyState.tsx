import * as React from "react";
import { motion } from "framer-motion/dist/framer-motion";

function EmptyState(props) {
  // console.log("*** in EmptyState ***")
  const onRunApp = () => {
    props.onHandleRunApp();
  };

  return (
    <motion.div
      className="empty-state-wrapper"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <div className="background-wrapper">
        <img
          className="empty-state-background"
          src={require("../assets/mesh-background.png")}
        />
      </div>
      <div className="empty-state">
        <div className="empty-state__image">
          <img className="layer-icon" src={require("../assets/new-logo.svg")} />
        </div>
        <div className="empty-state__title">Select a layer to get started.</div>
        <button
          className="button button--primary button--full"
          onClick={onRunApp}
        >
          Run Design Lint
        </button>
      </div>
    </motion.div>
  );
}

export default EmptyState;
