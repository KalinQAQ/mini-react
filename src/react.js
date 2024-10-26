import { REACT_ELEMENT } from "./constant";
import { wrapToVdom } from "./utils";
import { Component } from "./Component";
/**
 * 根据参数，返回一个React元素
 * @param {*} type 元素的类型 div span
 * @param {*} config 配置对象 className style
 * @param {*} children 后面所有参数都是children
 *
 */
function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }
  let props = { ...config };
  // 如果参数大于3说明有儿子，并且儿子数量大于一个
  if (arguments.length > 3) {
    props.children = Array.prototyp;
  } else if (arguments.length === 3) {
    debugger;
    props.children = wrapToVdom(children);
  }
  return {
    $$typeof: REACT_ELEMENT, // 默认是元素类型
    type, // span div
    props, // 属性
    ref,
    key,
  };
}

const React = {
  createElement,
  Component,
};
export default React;
