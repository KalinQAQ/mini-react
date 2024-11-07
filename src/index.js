import React from "./react";
import ReactDOM from "./react-dom/client";
import { updateQueue } from "./Component";
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
    this.state = { number: 0, age: 16 };
  }
  handleClick = () => {
    // 除构造函数外不能直接修改this.state，需要通过setState来修改状态
    // 因为setState有一个副作用，就是修改完状态后会让组件重新刷新
    updateQueue.isBatchingUpdate = true;
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
    updateQueue.isBatchingUpdate = false;
    updateQueue.batchUpdate();
  };
  render() {
    return (
      <div id="counter">
        <p>number:{this.state.number}</p>
        <p>age:{this.state.age}</p>
        <button onClick={this.handleClick}>+</button>
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
