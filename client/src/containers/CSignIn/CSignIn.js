import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  InstapaperIcon,
} from 'react-share';
import { Helmet } from 'react-helmet';
import { Prompt, withRouter } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  FormLabel,
  Chip,
  Snackbar,
  IconButton,
  Typography,
  InputBase,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { FileCopy } from '@material-ui/icons';
import copy from 'copy-to-clipboard';

import ValuePanel from '../../components/ValuePanel';
import { getWastonKeywords } from '../../helpers/endpoints/api';
import { updateAdvice } from '../../helpers/endpoints/api';
import { valueFields } from './valueFields';
import './CSignIn.scss';
import Finished from '../../images/results/finished.png';
import { isWidthDown } from '@material-ui/core/withWidth';
import ConfirmModal from '../../components/Modals/ConfirmModal';
import candidateActions from '../../redux/candidate/actions';
const { updateCandidate } = candidateActions;

const MAX_LEN = 150;

const CustomInput = withStyles(theme => ({
  root: {
    width: 'calc(100% - 130px)',
    border: 'solid 1px #d3d3d3',
    borderRadius: 4,
    margin: '10px 65px 30px',
  },
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    fontSize: 14,
    width: '100%',
    height: 38,
    padding: '10px 26px 10px 12px',
    lineHeight: '1.43',
    letterSpacing: 'normal',
    // transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      borderRadius: 4,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

class CSignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      advice: '',
      adviceLength: MAX_LEN,
      saved: false,
      showFireworks: true,
      keywords: [],
      snackBarOpen: false,
      snackBarText: 'success-copied',
      openLeaveModal: false,
      allowRedirect: false,
      clickEmoji: false,
      feedValue: '',
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({
        showFireworks: false,
      });
    }, 3000);
    const {
      testData: { wholeText },
    } = this.props;

    let keywords = [];
    try {
      const { data } = await getWastonKeywords(wholeText);
      keywords = data.keywords;
      this.setState({
        keywords,
      });
    } catch (error) {
      console.log('get keyword error: ', error);
    }
  }

  onChangeField = field => event => {
    this.setState({
      [field]: event.target.value,
    });
  };

  onChangeAdvice = event => {
    if (event.target.value.length <= MAX_LEN) {
      this.setState({
        advice: event.target.value,
        adviceLength: MAX_LEN - event.target.value.length,
      });
    }
  };

  onSaveAdvice = async () => {
    const { testData } = this.props;

    if (testData) {
      const { challengeId, pipelineId, email } = testData;

      const result = await updateAdvice({
        challengeId,
        pipelineId,
        userId: email,
        advice: this.state.advice,
      });

      if (result.data.success) {
        this.setState({
          saved: true,
        });
      }
    }
  };

  handleCloseSnackbar = () => {
    this.setState({
      saved: false,
    });
  };

  renderKeywords = () => {
    const { keywords } = this.state;

    if (!keywords) {
      return '';
    }

    return keywords.map((keyword, index) => {
      return (
        <Chip
          className="keyword-chip"
          label={keyword}
          variant="outlined"
          key={index}
        />
      );
    });
  };

  renderValues = () => {
    const { testData } = this.props;

    return valueFields.map((data, index) => {
      const { title, description, field } = data;
      const value = Math.round(testData[field] * 10) / 10 || 0; // round with 1 fixed point

      // if ((index === 2 || index == 3) && Number(value) === 0) {
      //   return '';
      // }
      return (
        <ValuePanel
          title={this.context.t(title)}
          description={this.context.t(description)}
          value={value}
          key={index}
        />
      );
    });
  };

  onEnterInformation = event => {
    const { testData } = this.props;
    const { challengeId, pipelineId, userId } = this.props.match.params;

    if (testData) {
      this.props.history.push(
        `/information/${challengeId}/${pipelineId}/${userId}`,
      );
    } else {
      this.props.history.push(`/information/1/1/1`);
    }
  };

  onGotoSandbox = () => {
    window.open('https://sandbox.nuggetai.com');
  };

  handleCopy = url => {
    copy(url);
    this.setState({
      snackBarMessage: this.context.t('sharable-link-copy'),
      snackBarOpen: true,
      snackBarText: 'success-copied',
    });
  };

  handleCloseSnackbar() {
    this.setState({ snackBarOpen: false, snackBarMessage: '' });
  }

  handleBlockedNavigation = nextLocation => {
    if (this.state.allowRedirect) return true;
    if (!nextLocation.pathname.startsWith('/enter')) return true;
    this.setState({
      openLeaveModal: true,
    });
    return false;
  };

  closeModal = callback => {
    const { challengeId, pipelineId } = this.props.testData;
    this.setState(
      {
        openLeaveModal: false,
        allowRedirect: true,
      },
      callback,
    );
    const URL = `/enter/${challengeId}/${pipelineId}`;
    console.log('Enter URL__________', this.props.history);
    window.location.href = URL;
  };

  handleEmojiClick = e => {
    const { updateCandidate } = this.props;
    const { challengeId, pipelineId, userId } = this.props.match.params;
    const postData = {
      feedback: e.target.getAttribute('data-value'),
    };
    updateCandidate({
      challengeId,
      pipelineId,
      userId,
      data: postData,
    });
    this.setState({
      clickEmoji: true,
      feedValue: e.target.getAttribute('data-value'),
    });
  };

  render() {
    const { challengeId, pipelineId } = this.props.match.params;
    const { challenge, testData, curCandidate } = this.props;
    console.log('curCandidate', curCandidate);
    const { snackBarOpen } = this.state;
    let shareURL = `${window.location.protocol}//${window.location.hostname}`;
    let shareTitle = '';
    let shareDesc = '';
    let shareImg = '';
    if (testData) {
      const { challengeId, pipelineId } = testData;
      if (challengeId && pipelineId) {
        shareURL = `${window.location.protocol}//${window.location.hostname}/enter/${challengeId}/${pipelineId}`;
      }
    }
    if (challenge) {
      shareTitle = challenge.test_name;
      shareDesc = this.context.t(challenge.test_desc).substring(0, 50);
      shareImg =
        `${window.location.protocol}//${window.location.hostname}` +
        require(`../../images/challenges/${challenge.image}`);
    }
    const company = challenge && challenge.user && challenge.user.company;

    return (
      <div className="candidate-signin-container">
        <Helmet>
          \
          <meta property="og:description" content={shareDesc} />
          <meta property="og:image" content={shareImg} />
          <meta property="og:image:secure_url" content={shareImg} />
        </Helmet>
        {this.state.showFireworks && (
          <div className="fireworks-background">
            <div className="pyro">
              <div className="before" />
              <div className="after" />
            </div>
          </div>
        )}

        <div className="candidate-header-container">
          <div className="topleft-image" />
          <div className="bottomright-image" />
          <div className="logo-image" />
        </div>
        <div className="static-icons">
          <ul>
            <li>
              <EmailShareButton
                url={shareURL}
                subject={shareTitle}
                body={shareDesc}
                className="social-icons"
              >
                <EmailIcon size={24} />
              </EmailShareButton>
            </li>
            <li>
              <TwitterShareButton
                url={shareURL}
                title={shareTitle}
                className="social-icons"
              >
                <TwitterIcon size={24} />
              </TwitterShareButton>
            </li>
            <li>
              <FacebookShareButton
                url={shareURL}
                quote={shareTitle}
                className="social-icons"
              >
                <FacebookIcon size={24} />
              </FacebookShareButton>
            </li>
            <li>
              <InstapaperShareButton
                url={shareURL}
                title={shareTitle}
                className="social-icons"
              >
                <InstapaperIcon size={24} />
              </InstapaperShareButton>
            </li>
          </ul>
        </div>
        <div className="feedback_form">
          <img
            className="header-image"
            src={Finished}
            alt={this.context.t('great-job-u')}
          />
          <React.Fragment>
            <div className="signin-login_form">
              <Typography className="feedback_form_header" component="div">
                {this.context.t('u-finished-it')}
              </Typography>
              <Typography className="feedback-button-group" component="div">
                <p className="feedback-button-group-header">
                  {this.context.t('how-was-your-experience')}
                </p>
                <div className="feedback-button-group-body">
                  {!this.state.clickEmoji && (
                    <>
                      <div
                        className="feedback-button"
                        onClick={this.handleEmojiClick}
                      >
                        <i className="fas fa-sad-tear fa-2x" data-value="1" />
                        <p className="feedback-text">
                          {this.context.t('very-bad')}
                        </p>
                      </div>
                      <div
                        className="feedback-button"
                        onClick={this.handleEmojiClick}
                      >
                        <i className="fas fa-frown fa-2x" data-value="2" />
                      </div>
                      <div
                        className="feedback-button"
                        onClick={this.handleEmojiClick}
                      >
                        <i
                          className="fas fa-meh-rolling-eyes fa-2x"
                          data-value="3"
                        />
                      </div>
                      <div
                        className="feedback-button"
                        onClick={this.handleEmojiClick}
                      >
                        <i className="fas fa-smile fa-2x" data-value="4" />
                      </div>
                      <div
                        className="feedback-button"
                        onClick={this.handleEmojiClick}
                      >
                        <i className="fas fa-laugh-beam fa-2x" data-value="5" />
                        <p className="feedback-text">
                          {this.context.t('very-good')}
                        </p>
                      </div>
                    </>
                  )}
                  {this.state.clickEmoji && (
                    <p className="feedback-button-group-text">
                      {this.context.t('We appreciate your feedback!')}
                    </p>
                  )}
                </div>
              </Typography>
              <Typography
                style={{ marginLeft: '65px', marginTop: '25px' }}
                component="div"
              >
                {this.context.t('Reference Number')}
              </Typography>
              <CustomInput
                value={curCandidate ? curCandidate._id : ''}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy"
                      onClick={() =>
                        this.handleCopy(curCandidate ? curCandidate._id : '')
                      }
                    >
                      <FileCopy />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography className="feedback_form_description" component="div">
                {this.context.t('congratulations-registered-your-answers')}
                {/* <br />
                <br /> */}
                {this.context.t('companies-are-also')}
              </Typography>
              <Typography className="feedback_form_description" component="div">
                {this.context.t('let-you-know-over-email')}
              </Typography>
            </div>
          </React.Fragment>
          {/* <div className="social-icons">
                <ul>
                  <li>
                    <a
                      target="_blank"
                      href={`https://twitter.com/home?status=${shareURL}`}
                    >
                      <i className="fab fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareURL}`}
                    >
                      <i className="fab fa-facebook" />
                    </a>
                  </li>
                </ul>
              </div> */}
          <div className="analytics-result-wrapper">
            <Typography
              className="feedback_form_description title-format"
              component="div"
            >
              <strong>{this.context.t('keywords')}</strong>
            </Typography>
            <div className="analytics-keywords">{this.renderKeywords()}</div>
          </div>
          <Typography
            className="feedback_form_description title-format"
            component="div"
          >
            <strong>{this.context.t('analytics')}</strong>
          </Typography>
          <div className="survey-form-wrapper">
            <div className="analytics-values">
              <div className="form-data">{this.renderValues()}</div>
            </div>
            <Button
              className="answer-btn"
              variant="contained"
              color="secondary"
              onClick={this.onEnterInformation}
              size="lg"
            >
              <span className="btn-title">
                {this.context.t('answer-some-questions')}
              </span>
            </Button>

            {/* <Button
              className="answer-btn-sandbox"
              variant="contained"
              onClick={this.onGotoSandbox}
              size="lg"
            >
              <span className="btn-title">
                {this.context.t('take-other-challnge')}
              </span>
            </Button> */}
            <div className="advice-form">
              <div className="form-data">
                <FormLabel component="text-field">
                  {this.context.t('your-voice')}
                </FormLabel>
                <TextField
                  id="advice"
                  className="advice-textarea"
                  value={this.state.advice}
                  onChange={this.onChangeAdvice}
                  margin="normal"
                  variant="outlined"
                  multiline={true}
                  rows={4}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        className="advice-left-length"
                        position="end"
                      >
                        {this.state.adviceLength}
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  className="advice-save-btn"
                  variant="contained"
                  color="primary"
                  onClick={this.onSaveAdvice}
                >
                  {this.context.t('save')}
                </Button>
                <Snackbar
                  className="success-saved-snackbar"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={this.state.saved}
                  autoHideDuration={3000}
                  onClose={this.handleCloseSnackbar}
                  onExited={this.handleCloseSnackbar}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={
                    <div id="message-id">
                      <CheckCircleIcon className="checkcircle-icon" />
                      <div className="message-content">
                        {this.context.t('success_time_feedback')}.
                      </div>
                    </div>
                  }
                  action={[
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      onClick={this.handleCloseSnackbar}
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackbar}
          open={snackBarOpen}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id="message-id">
              {this.context.t(this.state.snackBarText)}
            </span>
          }
        />
        <ConfirmModal
          isOpened={this.state.openLeaveModal}
          onConfirm={this.closeModal}
          // title={this.context.t('are-you-sure')}
          content={this.context.t('looks-like-you')}
          confirmText={this.context.t('continue')}
        />
        {!this.state.allowRedirect && (
          <Prompt message={this.handleBlockedNavigation} />
        )}
      </div>
    );
  }
}

CSignIn.contextTypes = {
  t: PropTypes.func,
};

CSignIn.propTypes = {
  candidateAuth: PropTypes.bool.isRequired,
  curCandidate: PropTypes.object,
  challenge: PropTypes.object,
  testData: PropTypes.object,
  updateCandidate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  candidateAuth: state.candidateReducer.candidateAuth,
  curCandidate: state.candidateReducer.curCandidate,
  challenge: state.challengeReducer.curChallenge,
  testData: state.resultReducer.testData,
});

const mapDispatchToProps = {
  updateCandidate,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CSignIn),
);
