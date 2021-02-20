import React from 'react'
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import { Container, Row } from 'react-bootstrap';
import { SearchIcon } from '@primer/octicons-react'

import HomeView from './components/HomeView';
import PlayerView from './components/PlayerView';
import TeamView from './components/TeamView';


export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container className="mt-1 mt-lg-5" fluid="lg">
          <Row>
            <div className="input-group input-group-lg">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-lg"><SearchIcon /></span>
              </div>
              <input type="text" className="form-control" placeholder="Filter highlights by player or team" disabled />
            </div>
          </Row>
        </Container>
        <Container className="container-card border my-0 mt-3 mb-lg-5 p-0" fluid="lg">
          <BrowserRouter>
            <Switch>
              <Route path="/players/:pid/:page/" render={ props => <PlayerView {...props} /> } />
              <Route path="/teams/:tid/:page/" render={ props => <TeamView {...props} /> }/>
              <Route path="/highlights/:page/" render={ props => <HomeView {...props} /> } />
            </Switch>
          </BrowserRouter>
        </Container>
      </div>
    );
  }
}
