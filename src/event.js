import { updateQueue } from "./Component";
/**
 * 给DOM元素添加事件处理函数
 * @param {*} dom 要添加事件的DOM元素
 * @param {*} eventType 事件的类型
 * @param {*} handler 事件处理函数
 */
export function addEvent(dom, eventType, handler) {
  // 判断DOM元素上有没有store属性，如果有则直接返回，如果没有则赋值为空对象然后返回
  let store = dom.store || (dom.store = {});
  // 向store中存放属性和值，属性是事情类型onClick 值是一个事件处理函数
  store[eventType.toLowerCase()] = handler;
  const eventName = eventType.toLowerCase();
  const name = eventName.replace(/Capture&/, "").slice(2);
  if (!document[name]) {
    document.addEventListener(eventName.slice(2).toLowerCase(), (event) => {
      dispatchEvent(event, true);
    });
    document.addEventListener(eventName.slice(2).toLowerCase(), (event) => {
      dispatchEvent(event, false);
    });
    document[name] = true;
  }
}

function dispatchEvent(event, isCapture) {
  // 为什么要把子DOM的事件全部委托给父类
  // 1. 为了减少绑定，提高性能 2.
  // target 事件源 type 事件名称
  let { target, type } = event;
  let eventType = `on${type}`; // onClick
  let eventTypeCapture = `on${type}capture`;
  let syntheticEvent = createSyntheticEvent(event);
  updateQueue.isBatchingUpdate = true;
  let targetStack = [];
  let currentTarget = target;
  while (currentTarget) {
    targetStack.push(currentTarget);
    currentTarget = currentTarget.parentNode;
  }
  if (isCapture) {
    for (let i = targetStack.length - 1; i >= 0; i--) {
      const currentTarget = targetStack[i];
      let { store } = currentTarget;
      let handler = store && store[eventTypeCapture];
      handler && handler(syntheticEvent);
    }
  } else {
    // 处理冒泡阶段
    for (let i = 0; i < targetStack.length; i++) {
      const currentTarget = targetStack[i];
      let { store } = currentTarget;
      let handler = store && store[eventType];
      handler && handler(syntheticEvent);
      if (syntheticEvent.isPropagationStopped) {
        break;
      }
    }
  }
  updateQueue.batchUpdate();
}
/**
 * 根据原生事件对象创建合成事件
 * 1. 为了实现兼容性处理
 * @param {*} nativeEvent
 */
function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    //把原生事件上的属性拷贝到合成事件对象上去
    let value = nativeEvent[key];
    if (typeof value === "function") value = value.bind(nativeEvent);
    syntheticEvent[key] = nativeEvent[key];
  }
  syntheticEvent.nativeEvent = nativeEvent;
  // 是否已经阻止了默认事件
  syntheticEvent.isDefaultPrevented = false;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

function preventDefault() {
  this.defaultPrevented = true;
  const event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    //IE
    event.returnValue = false;
  }
  this.isDefaultPrevented = true;
}

function stopPropagation() {
  const event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    //IE
    event.cancelBubble = true;
  }
  this.isPropagationStopped = true;
}
