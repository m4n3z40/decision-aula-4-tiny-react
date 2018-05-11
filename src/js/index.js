import TinyReact from './tiny-react';

const fetchLinks = () => new Promise(resolve => {
    setTimeout(() => resolve([
        { url: 'https://reactjs.org/', title: 'React JS', likes: 0 },
        { url: 'https://redux.js.org/', title: 'Redux', likes: 0 },
        { url: 'https://babeljs.io/', title: 'Babel JS', likes: 0 },
        { url: 'https://reacttraining.com/react-router/', title: 'React Router', likes: 0 },
        { url: 'https://github.com/', title: 'Github', likes: 0 },
    ]), 2000);
});

const rootElement = document.getElementById('root');

const LinkList = ({ links, onLinkClick }) => (
    <ul>
        {links.map(link => (
            <li>
                <button onClick={() => onLinkClick(link)} title="Likes">
                    {`\u2764 ${link.likes}`}
                </button>
                {' '}
                <a href={link.url}>{link.title}</a>
            </li>
        ))}
    </ul>
);

class App extends TinyReact.Component {
    constructor(props) {
        super(props);

        this.state = {
            coolLinks: [],
        };
    }

    componentDidMount() {
        fetchLinks().then(coolLinks => {
            this.setState({ coolLinks });
        });
    }

    handleLikeClick(link) {
        const newCoolLinks = this.state.coolLinks.slice();
        const index = newCoolLinks.indexOf(link);

        newCoolLinks[index] = Object.assign({}, link, { likes: link.likes + 1 });

        this.setState({ coolLinks: newCoolLinks });
    }

    handleRemoveLastClick() {
        const { coolLinks } = this.state;

        this.setState({
            coolLinks: coolLinks.slice(0, coolLinks.length - 1),
        });
    }

    render() {
        const { className } = this.props;
        const { coolLinks } = this.state;

        return (
            <main className={className}>
                <h1 className="main-title">Cool Links</h1>
                {
                    coolLinks.length === 0
                        ? <h3>Loading...</h3>
                        : <LinkList links={coolLinks} onLinkClick={this.handleLikeClick.bind(this)} />
                }
                <button onClick={this.handleRemoveLastClick.bind(this)}>
                    Remove last
                </button>
            </main>
        )
    }
}

TinyReact.render(<App className="container" />, rootElement);
