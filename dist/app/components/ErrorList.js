import * as React from "react";
import ErrorListItem from "./ErrorListItem";
function ErrorList(props) {
    const handleIgnoreClick = error => {
        props.onIgnoredUpdate(error);
    };
    const handleIgnoreAll = error => {
        props.onIgnoreAll(error);
    };
    const handleSelectAll = error => {
        props.onSelectAll(error);
    };
    function countInstancesOfThisError(error) {
        let nodesToBeSelected = [];
        props.allErrors.forEach(node => {
            node.errors.forEach(item => {
                if (item.value === error.value) {
                    if (item.type === error.type) {
                        nodesToBeSelected.push(item.node.id);
                    }
                }
            });
        });
        return nodesToBeSelected.length;
    }
    const errorListItems = props.errors.map((error, index) => (React.createElement(ErrorListItem, { error: error, errorCount: countInstancesOfThisError(error), index: index, key: index, handleIgnoreChange: handleIgnoreClick, handleSelectAll: handleSelectAll, handleIgnoreAll: handleIgnoreAll })));
    return React.createElement("ul", { className: "errors-list" }, errorListItems);
}
export default React.memo(ErrorList);
