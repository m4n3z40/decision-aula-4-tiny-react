const notEmpty = element => element !== undefined && element !== null && element !== false;

const TEXT_NODE = Symbol('TEXT_NODE');

const createTextElement = nodeValue => ({ type: TEXT_NODE, props: { nodeValue }});
const createNode = element => typeof element === 'string' ? createTextElement(element) : element;

function createElement(type, attributes, ...children) {
    const props = Object.assign({}, attributes);

    props.children = children
        .filter(notEmpty)
        .map(createNode);

    return { type, props };
}

const isListenerPropName = propName => propName.startsWith('on');
const isAttributePropName = propName => !isListenerPropName(propName) && propName !== 'children';

function render(element, parent) {
    const { type, props } = element;
    const dom = type === TEXT_NODE
        ? document.createTextNode('')
        : document.createElement(type);

    Object.keys(props)
        .filter(isListenerPropName)
        .forEach(propName => {
            const eventType = propName.toLowerCase().substring(2);

            dom.addEventListener(eventType, props[propName]);
        });

    Object.keys(props)
        .filter(isAttributePropName)
        .forEach(propName => {
            dom[propName] = props[propName];
        });

    const childElements = props.children || [];

    childElements.forEach(child => render(child, dom));

    parent.appendChild(dom);
}

export default { createElement, render };
