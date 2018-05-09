const isListenerPropName = propName => propName.startsWith('on');
const isAttributePropName = propName => !isListenerPropName(propName) && propName !== 'children';

export function render(element, parent) {
    const { type, props } = element;
    const dom = document.createElement(type);

    Object.keys(props)
        .filter(isListenerPropName)
        .forEach(propName => {
            const eventType = name.toLowerCase().substring(2);

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
