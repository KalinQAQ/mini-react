import React from "./react";
import ReactDOM from "./react-dom/client";
/**
 * 1.函数组件接收一个属性对象并返回一个React元素
 * 2.函数必须大写字母开头，内部通过大小写判断是自定义组件还是默认组件 div span
 * 3.函数组件在使用前必须先定义
 * 4.函数组件能且只能返回一个根元素
 */
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    // 设置默认状态，在构造函数中是为一个一个可以设置默认值的地方
    this.state = { number: 0 };
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
    setTimeout(() => {
      this.setState({
        number: this.state.number + 1,
      });
      console.log(this.state.number);
      this.setState({
        number: this.state.number + 1,
      });
      console.log(this.state.number);
    }, 1000);
  };
  clickButtonCapture = (event) => {
    console.log("clickButtonCapture");
  };
  clickDivCapture = (event) => {
    console.log("clickDivCapture");
  };
  clickButton = (event) => {
    console.log("clickButtonBubble");
    event.stopPropagation();
  };
  clickDiv = (event) => {
    console.log("clickDivBubble");
  };
  clickMyPCapture = () => {
    console.log("clickMyPCapture");
  };
  render() {
    return (
      <div
        id="counter"
        onClick={this.clickDiv}
        onClickCapture={this.clickDivCapture}
      >
        <div id="myp" onClickCapture={this.clickMyPCapture}>
          <p>number:{this.state.number}</p>
          <button
            onClick={this.clickButton}
            onClickCapture={this.clickButtonCapture}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}
// let element = (
//   <div className="title" style={{ color: "red" }}>
//     <span>hello</span>
//   </div>
// );
// console.log(element);
const DOMRoot = ReactDOM.createRoot(document.getElementById("root"));
// 就是把虚拟DOM变成真实DOM的过程，并且自动插入到页面中
let element = <ClassComponent />;
console.log(element);
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
