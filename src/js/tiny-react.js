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

const INTERNAL_INSTANCE = Symbol('INTERNAL_INSTANCE');

const createPublicInstance = (element, internalInstance) => {
    const { type: Type, props } = element;
    const publicInstance = new Type(props);

    publicInstance[INTERNAL_INSTANCE] = internalInstance;

    return publicInstance;
};

const updateInstance = instance => {
    const internalInstance = instance[INTERNAL_INSTANCE];
    const parent = internalInstance.dom.parentNode;
    const element = internalInstance.element;

    reconcile(parent, internalInstance, element);
};

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    setState(partialState) {
        this.state = Object.assign({}, this.state, partialState);

        updateInstance(this);
    }
}

const instantiateCustom = element => {
    let childElement;
    let publicInstance;
    const instance = {};

    if (element.type.prototype instanceof Component) {
        publicInstance = createPublicInstance(element, instance);

        childElement = publicInstance.render();
    } else {
        childElement = element.type(element.props);
    }

    const childInstance = instantiate(childElement);

    return Object.assign(instance, {
        dom: childInstance.dom,
        element,
        childInstances: [childInstance],
        publicInstance,
    });
};

const instantiateDom = element => {
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

const instantiate = element => {
    if (typeof element.type === 'function') {
        return instantiateCustom(element);
    } else {
        return instantiateDom(element);
    }
};

const reconcileChildren = ({ dom, childInstances }, { props }) => {
    const nextChildElements = props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);

    for (let i = 0; i < count; i++) {
        const newChildInstance = reconcile(dom, childInstances[i], nextChildElements[i]);

        if (newChildInstance !== null) {
            newChildInstances.push(newChildInstance);
        }
    }

    return newChildInstances;
};

const reconcile = (parent, instance, element) => {
    if (instance === null) {
        const newInstance = instantiate(element);

        parent.appendChild(newInstance.dom);

        return newInstance;
    } else if(element === null || element === undefined || element === false) {
        parent.removeChild(instance.dom);

        return null;
    } else if (instance.element.type !== element.type) {
        const newInstance = instantiate(element);

        parent.replaceChild(newInstance.dom, instance.dom);

        return newInstance;
    } else if (typeof element.type === 'function') {
        let childElement;

        if (instance.publicInstance) {
            instance.publicInstance.props = element.props;

            childElement = instance.publicInstance.render();
        } else {
            childElement = element.type(element.props);
        }

        const [oldChildInstance] = instance.childInstances;
        const childInstance = reconcile(parent, oldChildInstance, childElement);

        instance.dom = childInstance.dom;
        instance.childInstances = [childInstance];
        instance.element = element;

        return instance;
    } else {
        updateDomProperties(instance.dom, instance.element.props, element.props);

        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;

        return instance;
    }
};

function render(element, container) {
    rootInstance = reconcile(container, rootInstance, element);
}

export default { createElement, Component, render };
