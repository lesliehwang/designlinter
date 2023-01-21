import * as React from "react";
import { useState, useRef, useEffect } from "react";
function Menu(props) {
    const ref = useRef();
    const [menuState, setMenuState] = useState(false);
    useOnClickOutside(ref, () => hideMenu());
    const showMenu = () => {
        setMenuState(true);
    };
    const hideMenu = () => {
        setMenuState(false);
    };
    return (React.createElement("div", { className: "menu", ref: ref },
        React.createElement("div", { className: "menu-trigger", onClick: showMenu },
            React.createElement("img", { src: require("../assets/context.svg") })),
        React.createElement("ul", { className: "menu-items select-menu__list " +
                (menuState ? "select-menu__list--active" : "") }, props.menuItems.map((item, i) => {
            return (React.createElement("li", { className: "select-menu__list-item", key: i, onClick: event => {
                    event.stopPropagation();
                    item.event(props.error);
                    hideMenu();
                } }, item.label));
        }))));
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
export default React.memo(Menu);
