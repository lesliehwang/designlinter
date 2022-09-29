import * as React from "react";
function PanelHeader(props) {
    return (React.createElement("div", { className: "panel-header" },
        React.createElement("div", { className: "panel-header__action" },
            React.createElement("button", { className: "button--icon", onClick: props.handleHide },
                React.createElement("img", { className: "panel-collapse-icon", src: require("../assets/forward-arrow.svg") }))),
        React.createElement("div", { className: "panel-header__title" }, props.title)));
}
export default PanelHeader;
