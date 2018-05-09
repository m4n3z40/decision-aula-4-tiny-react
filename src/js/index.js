import { render } from './tiny-react';

const rootElement = document.getElementById('root');

const jsonDomTree = {
    type: 'div',
    props: {
        className: 'container',
        children: [
            {
                type: 'h1',
                props: {
                    className: 'main-title'
                }
            },
            {
                type: 'div',
                props: {
                    className: 'main-article',
                    children: [
                        {
                            type: 'p',
                            props: {
                                id: 'paragraph-one'
                            }
                        }
                    ]
                }
            }
        ]
    }
};

render(jsonDomTree, rootElement);
