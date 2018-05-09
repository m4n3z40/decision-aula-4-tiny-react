import { render } from './tiny-react';

const rootElement = document.getElementById('root');

const jsonDomTree = {
    type: 'div',
    props: {
        children: [
            {
                type: 'h1',
                props: {}
            },
            {
                type: 'div',
                props: {
                    children: [
                        {
                            type: 'p',
                            props: {}
                        }
                    ]
                }
            }
        ]
    }
};

render(jsonDomTree, rootElement);
