import UserDetails from './user/UserDetails';
import Home from './Home';

import '../style/App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/user"> <UserDetails/> </Route>
                    <Route exact path="/"> <Home/> </Route>
                    <Route path="*">
                        <div>404 placeholder</div>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}


export default App;
