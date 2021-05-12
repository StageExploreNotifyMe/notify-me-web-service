import {useHistory} from "react-router-dom";

const Home = () => {
    const history = useHistory();

    const NavigationCard = (props) => {
        return (<div className="card">
            <header className="card-header">
                <p className="card-header-title">{props.cardData.title}</p>
            </header>
            <footer className="card-footer">
                <button className="card-footer-item button is-link" onClick={(e) => {
                    e.preventDefault();
                    history.push(props.cardData.url)
                }}>
                    Open
                </button>
            </footer>
        </div>);
    };

    return <div>
        <section className="hero is-primary">
            <div className="hero-body">
                <h2 className="title is-2">Notify Me</h2>
            </div>
        </section>
        <section className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-4">
            <div className="columns is-multiline">
                <div className="column is-4 is-12-mobile"><NavigationCard cardData={{title: "User details", url: "/user"}}/></div>
                <div className="column is-4 is-12-mobile"><NavigationCard cardData={{title: "Organization details", url: "/organization/1"}}/></div>
                <div className="column is-4 is-12-mobile"><NavigationCard cardData={{title: "Venue details", url: "/venue/events"}}/></div>
                <div className="column is-4 is-12-mobile"><NavigationCard cardData={{title: "Admin Page", url: "/admin"}}/></div>
            </div>
        </section>
    </div>
}

export default Home