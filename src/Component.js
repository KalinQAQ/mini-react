import { findDOM, compareTwoVdom } from "./react-dom/client";
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    // 用来存放更新的状态
    this.pendingStates = [];
  }
  addState(partialState) {
    this.pendingStates.push(partialState); // 等待更新的或者说等待生效的状态
    // 准备更新
    this.emitUpdate();
  }
  emitUpdate() {
    this.updateComponent();
  }
  // 获取等待生效的状态和类的实例
  updateComponent() {
    let { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
    }
  }
  getState() {
    let { classInstance, pendingStates } = this;
    // 先获取类的实例上的老状态
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      // if (typeof nextState === "function") {
      //   nextState = nextState(state);
      // }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
  }
}
function shouldUpdate(classInstance, nextState) {
  // 先把计算得到的新状态赋给类的实例
  classInstance.state = nextState;
  // 让组件强制更新
  classInstance.forceUpdate();
}
export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  forceUpdate() {
    // 先获取老的虚拟DOM，再计算新的虚拟DOM，找到新老虚拟DOM的差异，把这些差异更新到真实DOM上
    // 获取老的虚拟DOM div#counter
    let oldRenderVdom = this.oldRenderVdom;
    // 根据新的状态计算新的虚拟DOM
    let newRenderVdom = this.render();
    // 首先获取到此组件对应的老的真实DOM
    const oldDOM = findDOM(oldRenderVdom);
    // 比较新旧虚拟DOM的差异，把更新后的结果放在真实DOM上
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    // 在更新后需要把oldRenderVdom更新为新的newRenderVdom
    // 第一次挂载 老的div#counter
    // 第一次更新的时候 新的div#counter
    // replaceChild div#root > 新的div#counter
    this.oldRenderVdom = newRenderVdom;
  }
}
