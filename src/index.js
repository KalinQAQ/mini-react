import React from "./react";
import ReactDOM from "./react-dom/client";
debugger;
let element = (
  <div className="title" style={{ color: "red" }}>
    <span>hello</span>
  </div>
);
console.log(element);
const DOMRoot = ReactDOM.createRoot(document.getElementById("root"));
// 就是把虚拟DOM变成真实DOM的过程，并且自动插入到页面中
DOMRoot.render(element);

/**
 {
    $$typeof: Symbol(react.element)
    "type": "div",
    "key": null,
    "ref": null,
    "props": {
        "className": "title",
        "style": {
            "color": "red"
        },
        "children": {
        $$typeof: Symbol(react.element)
            "type": "span",
            "key": null,
            "ref": null,
            "props": {
                "children": "hello"
            },
            "_owner": null,
            "_store": {}
        }
    },
    "_owner": null,
    "_store": {}
}
 */
