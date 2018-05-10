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
const getEventType = propName => propName.toLowerCase().substring(2);
let rootInstance = null;

const updateDomProperties = (dom, prevProps, nextProps) => {
    Object.keys(prevProps)
        .filter(isListenerPropName)
        .forEach(propName => {
            dom.removeEventListener(getEventType(propName), prevProps[propName]);
        });

    Object.keys(prevProps)
        .filter(isAttributePropName)
        .forEach(propName => {
            dom[propName] = null;
        });

    Object.keys(nextProps)
        .filter(isListenerPropName)
        .forEach(propName => {
            dom.addEventListener(getEventType(propName), nextProps[propName]);
        });

    Object.keys(nextProps)
        .filter(isAttributePropName)
        .forEach(propName => {
            dom[propName] = nextProps[propName];
        });
};

const instantiate = element => {
    const { type, props } = element;
    const dom = type === TEXT_NODE
        ? document.createTextNode('')
        : document.createElement(type);

    updateDomProperties(dom, [], props);

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
    } else if (instance.element.type === element.type) {
        updateDomProperties(instance.dom, instance.element.props, element.props);

        instance.element = element;

        return instance;
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
