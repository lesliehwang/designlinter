import * as React from "react";
function TotalErrorCount(props) {
    let totalErrorCount = props.errorArray.length;
    return (React.createElement(React.Fragment, null, totalErrorCount > 0 ? (React.createElement("div", { className: "totals-row" },
        React.createElement("div", { className: "section-title" }, "Error Count"),
        React.createElement("span", { className: "error-count" }, totalErrorCount))) : (React.createElement("div", { className: "totals-row totals-row--success" },
        React.createElement("div", { className: "section-title" },
            " ",
            "\uD83C\uDF89 Yay! No errors in the selection."),
        React.createElement("span", { className: "error-count success" },
            React.createElement("svg", { width: "12", height: "10", viewBox: "0 0 12 10", fill: "none" },
                React.createElement("path", { d: "M3.81353 7.88964L0.968732 4.78002L0 5.83147L3.81353 10L12 1.05145L11.0381 0L3.81353 7.88964Z", fill: "white" })))))));
}
export default TotalErrorCount;
