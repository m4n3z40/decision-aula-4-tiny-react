import TinyReact from './tiny-react';

const rootElement = document.getElementById('root');

const state = {
    coolLinks: [
        { url: 'https://reactjs.org/', title: 'React JS', likes: 0 },
        { url: 'https://redux.js.org/', title: 'Redux', likes: 0 },
        { url: 'https://babeljs.io/', title: 'Babel JS', likes: 0 },
        { url: 'https://reacttraining.com/react-router/', title: 'React Router', likes: 0 },
        { url: 'https://github.com/', title: 'Github', likes: 0 },
    ],
};

const App = ({ className }) => (
    <main className={className}>
        <h1 className="main-title">Cool Links</h1>
        <ul>
            {state.coolLinks.map(link => (
                <li>
                    <button onClick={() => link.likes++} title="Likes">{`\u2764 ${link.likes}`}</button>
                    {' '}
                    <a href={link.url}>{link.title}</a>
                </li>
            ))}
        </ul>
        <button onClick={() => state.coolLinks.pop()}>Remove last</button>
    </main>
);

const renderApp = () => {
    TinyReact.render(<App className="container" />, rootElement);

    requestAnimationFrame(renderApp);
};

renderApp();
