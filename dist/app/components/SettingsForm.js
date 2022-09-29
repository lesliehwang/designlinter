import * as React from "react";
import { useState } from "react";
function SettingsForm(props) {
    const [radiusValue, setRadiusValue] = useState("");
    const handleSubmit = event => {
        event.preventDefault();
        if (radiusValue.length) {
            parent.postMessage({
                pluginMessage: {
                    type: "update-border-radius",
                    radiusValues: radiusValue
                }
            }, "*");
        }
    };
    function handleClear() {
        parent.postMessage({
            pluginMessage: {
                type: "reset-border-radius"
            }
        }, "*");
    }
    return (React.createElement("div", { className: "settings-row" },
        React.createElement("div", { className: "settings-form", onSubmit: handleSubmit },
            React.createElement("h3", { className: "settings-title" }, "Border radius"),
            React.createElement("div", { className: "settings-label" }, "Set your preferred border radius values separated by commas (ex: \"2, 4, 6, 8\")."),
            React.createElement("div", { className: "input-icon" },
                React.createElement("div", { className: "input-icon__icon" },
                    React.createElement("div", { className: "icon icon--corner-radius icon--black-3" })),
                React.createElement("input", { type: "input", className: "input-icon__input", value: radiusValue, onChange: e => setRadiusValue(e.target.value), placeholder: props.borderRadiusValues }))),
        React.createElement("div", { className: "form-button-group" },
            React.createElement("button", { className: "button button--primary", onClick: handleSubmit }, "Save"),
            React.createElement("button", { className: "button button--secondary", onClick: handleClear }, "Reset"))));
}
export default SettingsForm;
