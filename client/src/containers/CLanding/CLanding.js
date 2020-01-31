import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Grid,
  TextField,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import StepIndicator from '../../components/StepIndicator';
import candidateActions from '../../redux/candidate/actions';
import challengeActions from '../../redux/challenge/actions';
import 'chartjs-plugin-labels';
import SkillsModal from '../../components/Modals/SkillsModal/SkillsModal';
import Slider from 'react-slick';
import './CLanding.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SkillCard from '../../components/SkillCard';
import CardsData from './CardsData';

const { getChallenge } = challengeActions;

const invalidMsg = [
  'Name field is required!',
  'Email field is incorrect!',
  'Function field is required!',
  'Role Level field is required!',
  'Terms & Conditions are required!',
  'This mail is already registered!',
];

class CLanding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: 0,
      fname: '',
      firstname: 'user',
      lastname: 'user',
      email: 'user@user.com',
      roleLevel: '',
      roleFunction: '',
      ethnicity: '',
      marital: '',
      degree: '',
      employment: '',
      isTermsAndCond: false,
      showTermsAndCond: false,
      wastonLang: 'en',

      showModal: false,
    };
  }

  /**
   * Settings for React Slick slides
   */
  settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    cssEase: 'linear',
    pauseOnHover: false,
    pauseOnFocus: false,
    focusOnSelect: false,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  onShowModal = () => {
    this.setState({ showModal: true });
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    const { getChallenge } = this.props;
    const { challengeId } = this.props.match.params;
    getChallenge(challengeId);
  }

  handleNext = async () => {
    const { challengeId, pipelineId } = this.props.match.params;
    this.props.history.push(`/enter/${challengeId}/${pipelineId}`);
  };

  render() {
    const { valid } = this.state;
    const validationStyle = valid === 0 ? 'validationTrue' : 'validationFalse';
    const { challenge } = this.props;
    const classname = `candidate-landing-container`;

    if (challenge && challenge.status === 'deleted') {
      window.location.href = '/error';
      // return <NotFound />;
    }
    const challenge_title = challenge ? challenge.test_name : '';

    return (
      <div className={classname}>
        <div className="candidate-header-container">
          <div className="logo-image" />
          <div className="topright-image" />
          <div className="bottomleft-image" />
        </div>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className="login_wrapper"
        >
          <Grid item sm={12}>
            <div className="login_form">
              <div>
                <Typography className="title-header">
                  {this.context.t('get-started')}
                </Typography>
              </div>
              <div>
                <h1>
                  <strong> {this.context.t(challenge_title)} </strong>
                </h1>
              </div>
              <div className="intro-text">
                <p> {this.context.t('you-have-hidden-talent')} </p>
              </div>
              <div className="bg-center-slider">
                <Slider {...this.settings}>
                  {CardsData.map((card, index) => (
                    <SkillCard {...card} key={index} />
                  ))}
                </Slider>
              </div>
              <Button onClick={this.onShowModal} className="button-show-modal">
                {this.context.t(
                  'take-a-quick-look-at-all-the-skills-we-can-measure',
                )}
              </Button>
              <Button
                className="continue-btn"
                variant="contained"
                color="primary"
                onClick={this.handleNext}
              >
                <strong className="button-text">
                  {` ${this.context.t('i-am-ready')}`}
                </strong>
                <i className="fas fa-arrow-circle-right" />
              </Button>
              {
                <div className={validationStyle}>
                  <i className="fa fa-exclamation-triangle valid__icon" />
                  <p className="valid__text">
                    & nbsp; {valid !== 0 && invalidMsg[valid - 1]}
                  </p>
                </div>
              }
            </div>
          </Grid>
        </Grid>
        {this.state.showModal && (
          <SkillsModal show={this.state.showModal} onHide={this.onCloseModal} />
        )}
      </div>
    );
  }
}

CLanding.contextTypes = {
  t: PropTypes.func,
};

CLanding.propTypes = {
  candidateAuth: PropTypes.bool.isRequired,
  curCandidate: PropTypes.object,
  // challenge: PropTypes.object.isRequired,
  getChallenge: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: {
      challengeId: PropTypes.string.isRequired,
      pipelineId: PropTypes.string.isRequired,
    },
  }),
};

const mapStateToProps = state => ({
  candidateAuth: state.candidateReducer.candidateAuth,
  curCandidate: state.candidateReducer.curCandidate,
  challenge: state.challengeReducer.curChallenge,
});

const mapDispatchToProps = {
  getChallenge,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CLanding),
);
