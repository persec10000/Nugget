import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import uuidv1 from 'uuid/v1';
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
} from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import DialogModal from '../../components/Modals/DialogModal';
import StepIndicator from '../../components/StepIndicator';
import candidateActions from '../../redux/candidate/actions';
import challengeActions from '../../redux/challenge/actions';
import { email as validEmail } from '../../utils/validation';
import { getEndpoint } from '../../utils/urlHelper';
import { getHeaders } from '../../utils/authUtil';
import './CEnter.scss';
import {
  testdata,
  loremIpsum,
  pitchIdea,
  communicateValue,
  dataScientist,
  b2b,
  marketing,
  strategy,
  engineer,
  consulting,
  crisisManagement,
} from '../TakeTest/data';
import NotFound from '../NotFound/NotFound';
import { Language } from '@material-ui/icons';
import CreatableSelect from 'react-select/creatable';
import CustomSelect from 'react-select';
import StyledDropzone from '../../components/Dropzone';
import { uploadFileWithName } from '../../utils/s3';
import { AWS_RESUME_S3_CREDENTIALS } from '../../constants/config';

import {
  expYearList,
  eduLevelList,
  skillOptionList,
  roleOptionList,
} from './data';

const { getChallenge } = challengeActions;
const { storeCandidate } = candidateActions;

const invalidMsg = [
  'Name field is required!',
  'Email field is incorrect!',
  'Function field is required!',
  'Role Level field is required!',
  'Terms & Conditions are required!',
  'This mail is already registered!',
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: '1px dotted black',
  }),
  control: (provided, state) => ({
    ...provided,
    minHeight: 67,
  }),
};

class CEnter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: 0,
      fname: '',
      firstname: '',
      lastname: '',
      email: '',
      roleLevel: '',
      roleFunction: '',
      step: 0,
      ethnicity: '',
      marital: '',
      degree: '',
      employment: '',
      isTermsAndCond: false,
      isAuthorized: false,
      showTermsAndCond: false,
      wastonLang: 'en',
      roles: [],
      skills: [],
      resumeUrl: '',
      curPipeLineType: '',
      expYearsValue: '',
      eduLevelValue: '',
      createdDate: '',
    };
  }

  componentDidMount() {
    const { getChallenge } = this.props;
    const { challengeId } = this.props.match.params;
    const createdDate = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '-');
    getChallenge(challengeId);
    this.setState({ createdDate });
  }

  componentDidUpdate() {
    const { challenge } = this.props;
    if (challenge) {
      for (let i = 0; i < challenge.pipelines.length; i += 1) {
        if (challenge.pipelines[i]._id === this.props.match.params.pipelineId) {
          if (challenge.pipelines[i].type !== this.state.curPipeLineType) {
            this.setState({
              curPipeLineType: challenge.pipelines[i].type,
            });
          }
          break;
        }
      }
    }
  }

  handleChangeInfo = name => event => {
    this.setState({ [name]: event.target.value, valid: 0 });
  };

  handleNext = async () => {
    const { step, curPipeLineType } = this.state;

    if (curPipeLineType === 'External') {
      if (step === 0) {
        const valid = await this.validateForm();
        if (!valid) {
          return;
        }
      } else if (step === 2) {
        this.handleSignin();
        return;
      }
      this.setState(prevState => ({
        step: prevState.step + 1,
      }));
    } else {
      if (step === 0) {
        const valid = await this.validateForm();
        if (!valid) {
          return;
        }
        this.setState(prevState => ({
          step: prevState.step + 1,
        }));
        return;
      } else if (step === 2) {
        this.handleSignin();
        return;
      }
      this.setState(prevState => ({
        step: prevState.step + 1,
      }));
    }
  };

  handleRolesSelected = async newValue => {
    const newArray = newValue.map(e => {
      return e.value;
    });

    this.setState({
      roles: newArray,
    });
  };

  handleSkillsSelected = async newValue => {
    const newArray = newValue.map(e => {
      return e.value;
    });
    this.setState({
      skills: newArray,
    });
  };

  validateForm = async () => {
    const {
      fname,
      firstname,
      lastname,
      email,
      roleFunction,
      roleLevel,
      isTermsAndCond,
    } = this.state;
    if (!firstname || !lastname) {
      this.setState({ valid: 1 });
      return false;
    } else if (validEmail(email) !== undefined || email.length < 5) {
      this.setState({ valid: 2 });
      return false;
    } else if (!roleFunction) {
      this.setState({ valid: 3 });
      return false;
    } else if (!roleLevel) {
      this.setState({ valid: 4 });
      return false;
    } else if (!isTermsAndCond) {
      this.setState({ valid: 5 });
      return false;
    }

    const { challengeId, pipelineId } = this.props.match.params;
    const params = {
      url: getEndpoint(
        `challenge/validation/${challengeId}/${pipelineId}/${email}`,
      ),
      method: 'get',
      headers: getHeaders(),
    };
    try {
      const validateRes = await axios.request(params);
      console.log(validateRes);
      console.log(validateRes);
      if (validateRes && !validateRes.data.valid) {
        this.setState({ valid: 6 });
        return false;
      }
      return true;
    } catch (error) {
      this.setState({ valid: 6 });
      return false;
    }
  };

  handleSignin = async () => {
    const {
      fname,
      firstname,
      lastname,
      email,
      roleLevel,
      roleFunction,
      wastonLang,
      isAuthorized,
      roles,
      skills,
      resumeUrl,
      curPipeLineType,
      expYearsValue,
      eduLevelValue,
      createdDate,
    } = this.state;

    let s3ResumeUrl;
    if (curPipeLineType === 'External' && resumeUrl) {
      const randName = uuidv1();
      let strLists = resumeUrl.name.split('.');
      await uploadFileWithName(
        resumeUrl,
        AWS_RESUME_S3_CREDENTIALS,
        `${randName}.${strLists[strLists.length - 1]}`,
      )
        .then(data => {
          s3ResumeUrl = data.location;
          console.log(s3ResumeUrl);
        })
        .catch(err => console.error(err));
    }
    const { challengeId, pipelineId } = this.props.match.params;
    const { storeCandidate } = this.props;

    const data = {
      firstname,
      lastname,
      email: email,
      roleFunction: roleFunction,
      roleLevel: roleLevel,
      wastonLang: wastonLang,
      isAuthorized,
      roles,
      skills,
      resumeUrl: s3ResumeUrl,
      expYears: expYearsValue,
      eduLevel: eduLevelValue,
      createdDate: createdDate,
    };

    console.log('candidate data: ', data);

    storeCandidate({
      data,
      challengeId,
      pipelineId,
    });
    this.props.history.push(`/taketest/${challengeId}/${pipelineId}`);
  };

  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked, valid: 0 });
  };

  handleShowTermsAndCond = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ showTermsAndCond: true });
  };

  handleCloseTermsAndCond = event => {
    this.setState({ showTermsAndCond: false });
  };

  handleAcceptTerms = event => {
    this.setState({ isTermsAndCond: true, showTermsAndCond: false });
  };

  handleDrop = (acceptedFiles, rejectedFiles, event) => {
    console.log(acceptedFiles);
    this.setState({
      resumeUrl: acceptedFiles[0],
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.candidateAuth) {
      const { challengeId, pipelineId } = this.props.match.params;
      this.props.history.push(`/taketest/${challengeId}/${pipelineId}`);
    }
  }

  render() {
    const {
      valid,
      step,
      isTermsAndCond,
      showTermsAndCond,
      isAuthorized,
      curPipeLineType,
    } = this.state;
    const validationStyle = valid === 0 ? 'validationTrue' : 'validationFalse';
    const { challenge } = this.props;
    const defaultTimer = 20;
    const defaultCompany = 'company';
    const classname = `candidate-enter-container ${
      step === 0 ? 'bg-center-image' : ''
    }`;

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
          <div className="center-image" />
          <div className="bottomleft-image" />
          <div className="step-wizard-container">
            <StepIndicator
              current={step}
              count={curPipeLineType === 'External' ? 4 : 3}
              direction="vertical"
            />
          </div>
          {/* {step === 0 && (
            <div className="waston-lang-selector">
              <FormControl
                variant="outlined"
                className="selector"
                color="primary"
              >
                <InputLabel
                  className="waston-lang-label"
                  ref={ref => {
                    this.InputLabelRef = ref;
                  }}
                  htmlFor="function-customized-select"
                >
                  {this.context.t('language')}
                </InputLabel>
                <Select
                  className="text_field"
                  value={this.state.wastonLang}
                  onChange={this.handleChangeInfo('wastonLang')}
                  input={
                    <OutlinedInput
                      className="select-label-input"
                      labelWidth={60}
                      name="lang"
                      placeholder="lang"
                      id="function-customized-select"
                    />
                  }
                >
                  <MenuItem value={'en'}>{this.context.t('english')}</MenuItem>
                  <MenuItem value={'es'}>{this.context.t('spanish')}</MenuItem>
                  <MenuItem value={'fr'} disabled={true}>
                    {this.context.t('french')}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          )} */}
        </div>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className="login_wrapper"
        >
          <Grid item sm={6}>
            <div className="login_form">
              <div>
                <Typography className="title-header">
                  {this.context.t('get-started')}
                </Typography>
              </div>
              <div>
                <h1>
                  <strong>{this.context.t(challenge_title)}</strong>
                </h1>
              </div>

              {step === 0 && (
                <div className="login-form-wrapper">
                  <React.Fragment className="login-form-wrapper">
                    <Grid container justify="center" spacing={2}>
                      <Grid item xs={6} style={{ paddingRight: '10px' }}>
                        <TextField
                          id="fname"
                          label={this.context.t('firstname')}
                          className="text_field"
                          value={this.state.firstname}
                          onChange={this.handleChangeInfo('firstname')}
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6} style={{ paddingLeft: '10px' }}>
                        <TextField
                          id="lname"
                          label={this.context.t('lastname')}
                          className="text_field"
                          value={this.state.lastname}
                          onChange={this.handleChangeInfo('lastname')}
                          margin="normal"
                          variant="outlined"
                          classes={{
                            root: { width: '100%', marginLeft: '10px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="email"
                          label={this.context.t('email')}
                          className="text_field"
                          value={this.state.email}
                          onChange={this.handleChangeInfo('email')}
                          margin="normal"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl
                          variant="outlined"
                          className="text_field_select selector"
                          color="primary"
                        >
                          <InputLabel
                            className="role-label"
                            ref={ref => {
                              this.InputLabelRef = ref;
                            }}
                            htmlFor="function-customized-select"
                          >
                            {this.context.t('function')}
                          </InputLabel>
                          <Select
                            className="text_field_select margin-bottom"
                            value={this.state.roleFunction}
                            onChange={this.handleChangeInfo('roleFunction')}
                            input={
                              <OutlinedInput
                                className="select-label-input"
                                labelWidth={60}
                                name="function"
                                placeholder="Function"
                                id="function-customized-select"
                              />
                            }
                          >
                            <MenuItem value={'consultant'}>
                              {this.context.t('consultant')}
                            </MenuItem>
                            <MenuItem value={'Finance & Accounting'}>
                              {this.context.t('finance-accounting')}
                            </MenuItem>
                            <MenuItem value={'Sales'}>
                              {this.context.t('sales')}
                            </MenuItem>
                            <MenuItem value={'Marketing'}>
                              {this.context.t('marketing')}
                            </MenuItem>
                            <MenuItem value={'General Management'}>
                              {this.context.t('general-management')}
                            </MenuItem>
                            <MenuItem value={'Human Resources'}>
                              {this.context.t('human-resources')}
                            </MenuItem>
                            <MenuItem value={'Information Technology'}>
                              {this.context.t('information-technology')}
                            </MenuItem>
                            <MenuItem value={'Operations'}>
                              {this.context.t('operations')}
                            </MenuItem>
                            <MenuItem value={'Strategy'}>
                              {this.context.t('strategy')}
                            </MenuItem>
                            <MenuItem value={'Other'}>
                              {this.context.t('other')}
                            </MenuItem>
                          </Select>
                          <Typography className="helper-text">
                            {this.context.t('tell-us-about-the-function')}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl
                          variant="outlined"
                          className="text_field_select selector"
                        >
                          <InputLabel
                            className="role-label"
                            ref={ref => {
                              this.InputLabelRef = ref;
                            }}
                            htmlFor="role-customized-select"
                          >
                            {this.context.t('rolelevel')}
                          </InputLabel>
                          <Select
                            className="text_field_select margin-bottom"
                            value={this.state.roleLevel}
                            onChange={this.handleChangeInfo('roleLevel')}
                            input={
                              <OutlinedInput
                                className="select-label-input"
                                name="role"
                                labelWidth={70}
                                placeholder="Role Level"
                                id="role-customized-select"
                              />
                            }
                          >
                            <MenuItem value={'Junior Analyst'}>
                              {this.context.t('junior-analyst')}
                            </MenuItem>
                            <MenuItem value={'Senior Analyst'}>
                              {this.context.t('senior-analyst')}
                            </MenuItem>
                            <MenuItem value={'Associate'}>
                              {this.context.t('associate')}
                            </MenuItem>
                            <MenuItem value={'Senior Associate'}>
                              {this.context.t('senior-associate')}
                            </MenuItem>
                            <MenuItem value={'Manager'}>
                              {this.context.t('manager')}
                            </MenuItem>
                            <MenuItem value={'Senior Manager'}>
                              {this.context.t('senior-manager')}
                            </MenuItem>
                            <MenuItem value={'Vice President'}>
                              {this.context.t('vice-president')}
                            </MenuItem>
                            <MenuItem value={'Senior Vice President'}>
                              {this.context.t('senior-vice-president')}
                            </MenuItem>
                            <MenuItem value={'Executive'}>
                              {this.context.t('executive')}
                            </MenuItem>
                            <MenuItem value={'Other'}>
                              {this.context.t('other')}
                            </MenuItem>
                            <MenuItem value={'Searching'}>
                              {this.context.t('iam-searching')}
                            </MenuItem>
                          </Select>
                          <Typography className="helper-text">
                            {this.context.t('tell-us-about-the-role')}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        {curPipeLineType === 'External' && (
                          <FormControl className="text_field check_field">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isAuthorized}
                                  onChange={this.handleCheck('isAuthorized')}
                                  value="isAuthorized"
                                  color="primary"
                                />
                              }
                              classes={{ label: 'check-label' }}
                              label={
                                <span>{this.context.t('i-am-authorized')}</span>
                              }
                            />
                          </FormControl>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl className="text_field check_field">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isTermsAndCond}
                                onChange={this.handleCheck('isTermsAndCond')}
                                value="isTermsAndCond"
                                color="primary"
                              />
                            }
                            classes={{ label: 'check-label' }}
                            label={
                              <span>
                                {this.context.t('accept-the')}{' '}
                                <span
                                  className="terms-cond"
                                  onClick={this.handleShowTermsAndCond.bind(
                                    this,
                                  )}
                                >
                                  {this.context.t('terms-conditions')}
                                </span>
                              </span>
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* <TextField
                    id="fname"
                    label={this.context.t('name')}
                    className="text_field"
                    value={this.state.fname}
                    onChange={this.handleChangeInfo('fname')}
                    margin="normal"
                    variant="outlined"
                  /> */}
                  </React.Fragment>
                </div>
              )}

              {step === 1 && (
                <div className="login-form-wrapper">
                  <Grid item xs={12}>
                    <p className="login-form-header">
                      {this.context.t('this-step-is-optional')}
                    </p>
                  </Grid>
                  {curPipeLineType === 'External' && (
                    <Grid container justify="center" spacing={2}>
                      <Grid item xs={6} style={{ paddingRight: '10px' }}>
                        <FormControl
                          variant="outlined"
                          className="text_field_select selector"
                          color="primary"
                        >
                          <InputLabel
                            className="expyears-label"
                            ref={ref => {
                              this.InputLabelRef = ref;
                            }}
                            htmlFor="expyears-customized-select"
                          >
                            Years of experience
                          </InputLabel>
                          <Select
                            className="text_field_select"
                            value={this.state.expYearsValue}
                            onChange={this.handleChangeInfo('expYearsValue')}
                            input={
                              <OutlinedInput
                                className="select-label-input"
                                name="expyears"
                                labelWidth={140}
                                placeholder="Years of Experience"
                                id="expyears-customized-select"
                              />
                            }
                          >
                            {expYearList.map(expYearsData => {
                              const { value, label } = expYearsData;

                              return (
                                <MenuItem value={value} key={value}>
                                  {label}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} style={{ paddingLeft: '10px' }}>
                        <FormControl
                          variant="outlined"
                          className="text_field_select selector"
                          color="primary"
                        >
                          <InputLabel
                            className="edulevel-label"
                            ref={ref => {
                              this.InputLabelRef = ref;
                            }}
                            htmlFor="edulevel-customized-select"
                          >
                            Education Level
                          </InputLabel>
                          <Select
                            className="text_field_select"
                            value={this.state.eduLevelValue}
                            onChange={this.handleChangeInfo('eduLevelValue')}
                            input={
                              <OutlinedInput
                                className="select-label-input"
                                name="edulevel"
                                labelWidth={120}
                                placeholder="Education Level"
                                id="edulevel-customized-select"
                              />
                            }
                          >
                            {eduLevelList.map(eduLevelData => {
                              const { value, label } = eduLevelData;

                              return (
                                <MenuItem value={value} key={value}>
                                  {label}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <CreatableSelect
                      placeholder={this.context.t('add-a-skill')}
                      isMulti
                      onChange={this.handleSkillsSelected}
                      options={skillOptionList}
                      styles={customStyles}
                      className="custom_select_field"
                      theme={theme => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#e1628d',
                        },
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CreatableSelect
                      placeholder={this.context.t('select-roles')}
                      isMulti
                      onChange={this.handleRolesSelected}
                      options={roleOptionList}
                      styles={customStyles}
                      className="custom_select_field"
                      theme={theme => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#e1628d',
                        },
                      })}
                    />
                  </Grid>

                  {curPipeLineType === 'External' && (
                    <StyledDropzone
                      onDrop={this.handleDrop}
                      placeholder={this.context.t('upload-resume')}
                    />
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="intro-text">
                  {/* <p>
                    {this.context.t('welcome')}{' '}
                    <strong>{this.state.firstname}</strong>
                    {'! '}
                    {this.context.t('company-would-like')}
                  </p>
                  <p>
                    {this.context.t('we-are-assessing')}
                    <strong>{this.context.t('we-at-nugget.ai')}</strong>
                  </p>
                  <p>
                    {this.context.t('company-following-tutorial')}
                    <strong>{`${challenge.timer ||
                      defaultTimer} minutes`}</strong>
                    {this.context.t('minutes-to-complete')}
                  </p>
                  <p>{this.context.t('good-luck')}</p> */}
                  <p>
                    {this.context.t('you-will-solve-a-problem')}
                    <strong>{this.context.t('believe-there-is')}</strong>
                  </p>
                  <p>
                    {this.context.t('to-prepare-you-for-the-challenge')}
                    <strong>{`15 ${this.context.t('min')}`}</strong>
                    {this.context.t('to-complete')}
                  </p>
                  <p>{this.context.t('good-luck')}</p>
                </div>
              )}

              {step === 2 && (
                <>
                  <Typography className="warning-text" component="p">
                    {this.context.t('dont-take-this-one-your-phone')}.
                  </Typography>
                  <Typography className="warning-text" component="p">
                    {this.context.t('minimum-words')}
                    <strong>{this.context.t('150-words')}</strong>
                  </Typography>
                </>
              )}
              <Button
                className="continue-btn"
                variant="contained"
                color="primary"
                onClick={this.handleNext}
              >
                <span className="button-text">
                  {step === 0 && this.context.t('continue')}
                  {step === 1 && this.context.t('INSTRUCTIONS')}
                  {step === 2 &&
                    `${this.context.t('continue')} ${this.context.t(
                      'to-tutorial',
                    )}`}
                </span>
                <i className="fas fa-arrow-circle-right" />
              </Button>

              {
                <div className={validationStyle}>
                  <i className="fa fa-exclamation-triangle valid__icon" />
                  <p className="valid__text">
                    &nbsp;
                    {valid !== 0 && invalidMsg[valid - 1]}
                  </p>
                </div>
              }
            </div>
          </Grid>
        </Grid>
        <DialogModal
          isOpen={showTermsAndCond}
          title={this.context.t('terms-conditions')}
          handleClose={this.handleCloseTermsAndCond.bind(this)}
          handleOk={this.handleAcceptTerms.bind(this)}
        >
          <div>{this.context.t('terms-and-condition')}</div>{' '}
        </DialogModal>
      </div>
    );
  }
}

CEnter.contextTypes = {
  t: PropTypes.func,
};

CEnter.propTypes = {
  storeCandidate: PropTypes.func.isRequired,
  candidateAuth: PropTypes.bool.isRequired,
  curCandidate: PropTypes.object,
  challenge: PropTypes.object.isRequired,
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
  storeCandidate,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CEnter));
