export function render(element, parent) {
    const { type, props } = element;
    const dom = document.createElement(type);
    const childElements = props.children || [];

    childElements.forEach(child => render(child, dom));

    parent.appendChild(dom);
}
