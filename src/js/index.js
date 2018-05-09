import { render } from './tiny-react';

const rootElement = document.getElementById('root');

const jsonDomTree = {
    type: 'div',
    props: {
        onClick: () => alert('Clicked'),
        className: 'container',
        children: [
            {
                type: 'h1',
                props: {
                    className: 'main-title',
                    children: ['This is a title']
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
                                id: 'paragraph-one',
                                children: ['This is some paragraph text']
                            }
                        }
                    ]
                }
            }
        ]
    }
};

render(jsonDomTree, rootElement);
