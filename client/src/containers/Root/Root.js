import React, { Component } from 'react';
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import Header from '../../components/Header/Header';
import './Root.scss';

import AuthRoute from '../../components/AuthRoute';
import VerifyRoute from '../../components/VerifyRoute';

import Loading from './svg';
import { PIXEL_ID } from '../../constants/config';
import ReactPixel from 'react-facebook-pixel';
import { isExpired, saveLogTime } from '../../utils/localStorageUtil';
import authAction from '../../redux/auth/actions';

const { logoutRequest } = authAction;

const NotFound = Loadable({
  loader: () => import('../NotFound/NotFound'),
  loading: Loading,
});

const Login = Loadable({
  loader: () => import('../Login/Login'),
  loading: Loading,
});

const Register = Loadable({
  loader: () => import('../Register/Register'),
  loading: Loading,
});

const Admin = Loadable({
  loader: () => import('../Admin'),
  loading: Loading,
});

const Home = Loadable({
  loader: () => import('../Home/Home'),
  loading: Loading,
});

const Setting = Loadable({
  loader: () => import('../Setting'),
  loading: Loading,
});

const Dashboard = Loadable({
  loader: () => import('../Dashboard/Dashboard'),
  loading: Loading,
});

const CreateTest = Loadable({
  loader: () => import('../CreateTest/CreateTest'),
  loading: Loading,
});

const Results = Loadable({
  loader: () => import('../Results/Results'),
  loading: Loading,
});

const CEnter = Loadable({
  loader: () => import('../CEnter/CEnter'),
  loading: Loading,
});

const CLanding = Loadable({
  loader: () => import('../CLanding/CLanding'),
  loading: Loading,
});

const CEnterInfo = Loadable({
  loader: () => import('../CEnterInfo/CEnterInfo'),
  loading: Loading,
});

const COnboard = Loadable({
  loader: () => import('../COnboard/COnboard'),
  loading: Loading,
});

const TakeTest = Loadable({
  loader: () => import('../TakeTest/TakeTest'),
  loading: Loading,
});
const CSignIn = Loadable({
  loader: () => import('../CSignIn/CSignIn'),
  loading: Loading,
});
const CRegister = Loadable({
  loader: () => import('../CRegister/CRegister'),
  loading: Loading,
});
const CDashboard = Loadable({
  loader: () => import('../CDashboard/CDashboard'),
  loading: Loading,
});
const RawEvents = Loadable({
  loader: () => import('../RawEvents/RawEvents'),
  loading: Loading,
});
const Sandbox = Loadable({
  loader: () => import('../Sandbox/Sandbox'),
  loading: Loading,
});
const Science = Loadable({
  loader: () => import('../Science/Science'),
  loading: Loading,
});
const IndividualResult = Loadable({
  loader: () => import('../IndividualResult/IndividualResult'),
  loading: Loading,
});
const PasswordReset = Loadable({
  loader: () => import('../PasswordReset/PasswordReset'),
  loading: Loading,
});
const ConfirmPasswordReset = Loadable({
  loader: () => import('../ConfirmPasswordReset/ConfirmPasswordReset'),
  loading: Loading,
});
const ValidateUser = Loadable({
  loader: () => import('../ValidateUser/ValidateUser'),
  loading: Loading,
});

const VerifyEmail = Loadable({
  loader: () => import('../VerifyEmail/VerifyEmail'),
  loading: Loading,
});

const ChangePassword = Loadable({
  loader: () => import('../ChangePassword/ChangePassword'),
  loading: Loading,
});

const Survey = Loadable({
  loader: () => import('../Survey/Survey'),
  loading: Loading,
});

const isAssessmentPage = path => {
  const assessmentPageList = [
    'enter',
    'taketest',
    'candidatelogin',
    'faq',
    'information',
    'survey',
    'landing',
  ];
  for (const pageName of assessmentPageList) {
    if (path.includes(pageName)) {
      return true;
    }
  }
  return false;
};

const isResultPage = path => {
  return path.includes('/results');
};

class Root extends Component {
  componentDidMount() {
    const shareURL = `${window.location.hostname}`;
    if (shareURL !== 'nuggetai.com') {
      return;
    }
    ReactPixel.init(PIXEL_ID, {}, { debug: false, autoConfig: true });
    ReactPixel.pageView();
    ReactPixel.fbq('track', 'PageView');
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleCheck();
    }
  }

  handleCheck() {
    const { logoutRequest } = this.props;
    if (isExpired()) {
      logoutRequest();
      this.props.history.push(`/login`);
    } else {
      saveLogTime();
    }
  }

  render() {
    const { isLoggedIn, history } = this.props;
    // console.log('root update', history.location.pathname);
    const rootComponent = <Redirect to={isLoggedIn ? '/dashboard' : '/home'} />;
    const isAssessment = isAssessmentPage(history.location.pathname);
    const isResult = isResultPage(history.location.pathname);
    const rootStyle = isAssessment ? 'test_container' : 'root__container';

    const hasHeader = !isAssessment && !isResult;

    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <div className="wrapper">
            {hasHeader && <Header />}
            <div className={rootStyle}>
              <Switch>
                <VerifyRoute exact path="/" component={Dashboard} />
                {/* <Route exact path="/" render={() => rootComponent} /> */}
                <Route path="/home" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/register/:islogin?" component={Login} />
                <AuthRoute path="/setting" component={Setting} />
                <Route path="/dashboard" component={Dashboard} />
                <Route exact path="/createtest" component={CreateTest} />
                <Route path="/results/:challengeId" component={Results} />
                <Route
                  path="/enter/:challengeId/:pipelineId"
                  component={CEnter}
                />
                <Route
                  path="/landing/:challengeId/:pipelineId"
                  component={CLanding}
                />
                <Route
                  path="/onboard/:challengeId/:pipelineId"
                  component={COnboard}
                />
                <Route
                  path="/taketest/:challengeId/:pipelineId"
                  component={TakeTest}
                />
                <Route
                  path="/candidatelogin/:challengeId/:pipelineId/:userId"
                  component={CSignIn}
                />
                <Route
                  path="/information/:challengeId/:pipelineId/:userId"
                  component={CEnterInfo}
                />
                <Route path="/candidateregister" component={CRegister} />
                <Route path="/cdashboard" component={CDashboard} />
                <Route
                  path="/rawevents/:challengeId/:pipelineId/:userEmail"
                  component={RawEvents}
                />
                <Route path="/science" component={Science} />
                <Route path="/sandbox" component={Sandbox} />
                <Route path="/res" component={IndividualResult} />
                <Route
                  path="/survey/:challengeId/:pipelineId/:userId"
                  component={Survey}
                />
                <Route exact path="/password-reset" component={PasswordReset} />
                <Route
                  exact
                  path="/password-reset/:token"
                  component={ConfirmPasswordReset}
                />
                <Route
                  exact
                  path="/verify-user/:token"
                  component={ValidateUser}
                />
                <Route exact path="/verify-email" component={VerifyEmail} />
                <Route
                  exact
                  path="/changepassword"
                  component={ChangePassword}
                />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

Root.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  logoutRequest: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.authReducer.isLoggedIn,
  user: state.authReducer.user,
});

const mapDispatchToProps = {
  logoutRequest,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root));
