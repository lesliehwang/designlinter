import * as React from "react";

function PanelHeader(props) {
  // console.log("*** in PanelHeader ***")
  return (
    <div className="panel-header">
      <div className="panel-header__action">
        <button className="button--icon" onClick={props.handleHide}>
          <img
            className="panel-collapse-icon"
            src={require("../assets/forward-arrow.svg")}
          />
        </button>
      </div>
      <div className="panel-header__title">{props.title}</div>
    </div>
  );
}

export default PanelHeader;
