import { REACT_TEXT } from "../constant";

/**
 * 把虚拟DOM变成真实的DOM并且插入到container容器里
 * @param {*} vdom
 * @param {*} container
 */
function mount(vdom, container) {
  // 传入虚拟DOM，返回真实DOM
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}
// 虚拟DOM -> 真实DOM
function createDOM(vdom) {
  const { type, props } = vdom;
  let dom;
  // 如果此虚拟DOM类型是一个文本节点 string number
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  if (props) {
    updateProps(dom, {}, props);
    if (props.children) {
      // 如果是独生子的话，把独生子的虚拟DOM转换真实DOM插入到DOM节点上
      if (typeof props.children === "object" && props.children.type) {
        mount(props.children, dom);
      } else if (Array.isArray(props.children)) {
        reconcileChildren(props.children, dom);
      }
    }
  }
  return dom;
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom; // FunctionComponent
  const renderVdom = type(props);
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  let { type, props } = vdom;
  let classInstance = new type(props);
  let renderVdom = classInstance.render();
  let dom = createDOM(renderVdom);
  return dom;
}

function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    mount(childrenVdom[i], parentDOM);
  }
}
/**
 * 更新DOM元素的属性
 * 1.把新的属性全部赋上去
 * 2.把老的属性在新的属性对象没有的，删除掉
 * @param {*} dom
 * @param {*} oldProps
 * @param {*} newProps
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
  for (let key in newProps) {
    // children属性会在后面单独处理
    if (key === "children") {
      continue;
    } else if (key === "style") {
      // 把样式对象上的所有属性都赋给真实DOM
      let styleObject = newProps[key];
      for (const attr in styleObject) {
        dom.style[attr] = styleObject[attr];
      }
    } else {
      // 如果是其他属性，则直接赋值
      dom[key] = newProps[key];
    }
  }
  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

class DOMRoot {
  constructor(container) {
    this.container = container;
  }

  render(vdom) {
    mount(vdom, this.container);
  }
}
function createRoot(container) {
  return new DOMRoot(container);
}

const ReactDOM = {
  createRoot,
};

export default ReactDOM;
