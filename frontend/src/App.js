import './App.css';
import './formstyle.css';
import './buttons.css';
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';
import { getPolls } from './redux/actions/polls'
import { verifyCurrentUser } from './redux/actions/auth'
import { getUsers } from './redux/actions/users'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './components/AlertTemplate'
import AlertSystem from './components/AlertSystem'
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import PollDetail from './components/polls/PollDetail';
import NewPollForm from './components/polls/NewPollForm';

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE
}

class App extends React.Component {

  componentDidMount() {
    this.props.getPolls()
    this.props.getUsers()
    this.props.verifyCurrentUser()
    console.log('user verified')
  }

  render() {
    const { location } = this.props;
    return (
      <AlertProvider template={ AlertTemplate } {...options}>
        <Container>
          <AlertSystem/>
          <Navbar/>

          <AnimatePresence exitBeforeEnter initial={false}>
          
            <Switch location={ location } key={ location.pathname } >
              <Route exact path="/register" component={ Register } />

              <Route exact path="/logout" component={ Logout } />

              <Route exact path="/login" component={ Login } />

              <ProtectedRoute exact path="/users/:username" component={ UserProfile } />

              <ProtectedRoute exact path="/polls/:id" component={ PollDetail } /> 

              <ProtectedRoute exact path="/add-poll" component={ NewPollForm } />

              <Route exact path="/" component={ Home } />
            </Switch>
          
          </AnimatePresence>
            
        </Container>
      </AlertProvider>
      
      )
    }
  }

export default connect(null, { getPolls, verifyCurrentUser, getUsers })(withRouter(App)) ;
