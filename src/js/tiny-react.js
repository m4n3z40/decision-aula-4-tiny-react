const notEmpty = element => element !== undefined && element !== null && element !== false;

const flatMap = (list, fn) => {
    let newList = [];

    for (const item of list) {
        const newItem = fn(item);

        if (Array.isArray(newList)) {
            newList = newList.concat(newItem);
        } else {
            newList.push(item);
        }
    }

    return newList;
};

const TEXT_NODE = Symbol('TEXT_NODE');

const createTextNode = nodeValue => ({ type: TEXT_NODE, props: { nodeValue }});
const createNode = element => typeof element === 'string' ? createTextNode(element) : element;

function createElement(type, attributes, ...children) {
    const props = Object.assign({}, attributes);

    props.children = flatMap(children.filter(notEmpty), createNode);

    return { type, props };
}

const isListenerPropName = propName => propName.startsWith('on');
const isAttributePropName = propName => !isListenerPropName(propName) && propName !== 'children';
let rootInstance = null;

const instantiate = element => {
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
    const childInstances = childElements.map(instantiate);

    childInstances.forEach(child => dom.appendChild(child.dom));

    return { dom, element, childInstances };
};

const reconcile = (parent, instance, element) => {
    if (instance === null) {
        const newInstance = instantiate(element);

        parent.appendChild(newInstance.dom);

        return newInstance;
    } else {
        const newInstance = instantiate(element);

        parent.replaceChild(newInstance.dom, instance.dom);

        return newInstance;
    }
};

function render(element, container) {
    rootInstance = reconcile(container, rootInstance, element);
}

export default { createElement, render };
