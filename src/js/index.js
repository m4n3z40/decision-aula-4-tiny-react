import { createElement, render } from './tiny-react';

const rootElement = document.getElementById('root');

const jsonDomTree = createElement(
    'div',
    { onclick: () => alert('Clicked'), className: 'container' },
    createElement(
        'h1',
        { className: 'main-title' },
        'This is a title'
    ),
    createElement(
        'div',
        { className: 'main-article' },
        createElement(
            'p',
            { id: 'paragraph-one' },
            'This is some paragraph text'
        ),
    ),
);

render(jsonDomTree, rootElement);
