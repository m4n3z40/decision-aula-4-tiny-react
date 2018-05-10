import TinyReact from './tiny-react';

const rootElement = document.getElementById('root');

const App = (
    <div className="container" onClick={() => alert('Clicked')}>
        <h1 className="main-title">This is a title</h1>
        <div className="main-article">
            <p id="paragraph-one">This is some paragraph text</p>
        </div>
    </div>
);

TinyReact.render(App, rootElement);
