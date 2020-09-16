import './App.css';
import './formstyle.css';
import './buttons.css';
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';
import { getPolls } from './redux/actions/polls'
import { loadCurrentUser } from './redux/actions/auth'
import { getUsers } from './redux/actions/users'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './components/ui/AlertTemplate'
import AlertSystem from './components/ui/AlertSystem'
import Home from './components/containers/Home';
import Navbar from './components/ui/Navbar';
import Login from './components/containers/Login';
import Logout from './components/containers/Logout';
import Register from './components/containers/Register';
import UserProfile from './components/containers/UserProfile';
import ProtectedRoute from './components/containers/ProtectedRoute';
import PollDetail from './components/polls/PollDetail';
import NewPollForm from './components/polls/NewPollForm';
import ResetPassword from './components/containers/ResetPassword';
import ResetPasswordConfirm from './components/containers/ResetPasswordConfirm';
import ActivateAccount from './components/containers/ActivateAccount'


const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '10px',
  transition: transitions.SCALE
}

class App extends React.Component {

  componentDidMount() {
    this.props.getPolls()
    this.props.getUsers()
    this.props.loadCurrentUser()
    console.log(`${process.env.NODE_ENV} mode`)
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

              <Route exact path="/activate/:uid/:token" component={ ActivateAccount } />

              <Route exact path="/logout" component={ Logout } />

              <Route exact path="/login" component={ Login } />

              <Route exact path="/reset-password" component={ ResetPassword } />

              <Route exact path="/password/reset/confirm/:uid/:token" component={ ResetPasswordConfirm } />

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

export default connect(null, { getPolls, loadCurrentUser, getUsers })(withRouter(App)) ;
