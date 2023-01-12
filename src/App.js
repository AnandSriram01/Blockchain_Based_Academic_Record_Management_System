import React, { Component } from 'react';
import {HashRouter,Switch,Route} from 'react-router-dom';
import Home from "./routes/home";
import College from "./routes/college";
import Professor from "./routes/professor";
import Student from "./routes/student";
import Signup from "./routes/signup";
import Embed from "./routes/embed";
class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/"exact>
            <Home/>
          </Route>
          <Route path="/college" exact>
            <College/>
          </Route>
          <Route path="/signup" exact>
            <Signup/>
          </Route>    
          <Route path="/student" exact>
            <Student/>
          </Route>
          <Route path="/professor" exact>
            <Professor/>
          </Route>
          <Route path="/embed/:id" exact render={(props) => <Embed {...props}/>}>
          </Route>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;