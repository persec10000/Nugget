import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import moment from 'moment';
import copy from 'copy-to-clipboard';

import { Add, ArrowBack } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import {
  Grid,
  Typography,
  Snackbar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
} from '@material-ui/core';

import { getEmployees, getCandidates } from '../../../airtable/demo';

import { PageTabs, PageTab } from '../Pages/Result.styled';

import FaqIcon from '@material-ui/icons/LibraryBooks';
import { getAvatarPath } from '../../../utils/userUtil';
import Picture from '../../../components/AvatarMini';
import NotificationButton from '../../../components/NotificationButton';
import AnouncementButton from '../../../components/AnouncementButton';
import DefaultAvatar from '../../../images/characters/04-character.png';

import '../Results.scss';

import challengeActions from '../../../redux/challenge/actions';
import pipelineActions from '../../../redux/pipeline/actions';
import candidateActions from '../../../redux/candidate/actions';
import adminActions from '../../../redux/admin/actions';

import AddPipelineModal from '../../../components/Modals/AddPipelineModal';
import ChartDetailModal from '../../../components/Modals/ChartDetailModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import PipeLine from '../../../components/PipeLine';
import InfoCard from '../../../components/InfoCard';
import TableDataSetting from '../../../components/Modals/TableDataSetting';
import Footer from '../../../components/Footer/Footer';
import getDummyProfiles from './../dummyProfiles';
import SettingMenu from './../SettingMenu';
import NotFound from '../../NotFound/NotFound';
import Insight from './DemoInsight';

const { getChallenge, updateChallenge, deleteChallenge } = challengeActions;
const { createPipeline, deletePipeline, updatePipeline } = pipelineActions;
const { updateCandidate, getCandidate } = candidateActions;
const { getPipelinesRequest } = adminActions;

const INSIGHT_TAB = 1;

class DemoTalent extends Component {
  constructor(props) {
    super(props);

    this.bubbleChartRef = React.createRef();
    const { challengeId } = props;

    this.pipelineRef = React.createRef();

    this.state = {
      selected: 0,
      challengeDesc: '',
      isPaneOpen: false,
      stepvalue: 1,
      open: false,
      showPipModal: false,
      showBubbleDetailModal: false,
      showSettingModal: false,
      snackBarOpen: false,
      snackBarMessageInfo: {},
      currentBenchmark: 0,
      currentTalentFunnel: 1,
      hasGraph: false,
      filterValue: '',
      suggestions: [],
      currentSearchPipelineId: 0,
      challengeId,
      candidates: [],
      talentCandidates: [],
      challenge: {
        test_name: 'Demo',
      },
      pipelines: [],
      selectedUsers: [],
      currentBubble: {},
      showDeleteConfirmModal: false,
      currentPipelineId: 0,
      dummyPipelineTitles: ['Employees', 'Candidates'],
      dummyPipelineType: ['Internal', 'External'],
      skillCategories: [],
      progressStep: 1,
      showCardDeleteModal: false,
      isChangedUserState: false,
      curEmail: '',
      curPipeIdx: -1,
      scatterSeeMore: false,
      curPipeline: 0,
      curPipelineResult: {},
    };
    this.tableData = {
      fullname: '',
      score: 0,
    };
    this.snackBarQueue = [];
  }

  componentDidMount = async () => {
    Modal.setAppElement(this.el);

    const employees = await getEmployees();
    const candidates = await getCandidates();
    console.log('employees: ', employees);
    console.log('candidates: ', candidates);

    const pipelines = [
      {
        _id: 0,
        color: '#552c84',
        users: employees,
        title: 'Employees',
      },
      {
        _id: 1,
        color: '#fc8e7f',
        users: candidates,
        title: 'Candidates',
      },
    ];
    this.setState({
      employees,
      candidates,
      pipelines,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.curChallenge !== this.props.curChallenge ||
      this.state.isChangedUserState !== prevState.isChangedUserState
    ) {
      if (!this.props.curChallenge || !this.props.curChallenge['pipelines']) {
        return;
      }

      const { pipelines } = this.props.curChallenge;

      const candidates = pipelines.map(pipeline => pipeline.users);

      this.setState({
        challenge: this.props.curChallenge,
        pipelines,
        candidates: candidates[0],
        filteredCandidates: candidates[0],
        talentCandidates: candidates,
      });
    }
  };

  handleChangeChallengeDesc = event => {
    this.setState({
      challengeDesc: event.target.value,
    });
  };

  handleStepChange = event => {
    event.preventDefault();
    this.setState({ stepvalue: Math.random() });
  };

  handleChangeTab = value => {
    this.setState({ tabValue: value });
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  handleClickAddPipeline = () => {};

  handleAddPipeline = (title, benchmark, color, type) => {
    this.setState({ showPipModal: false });
    const { challengeId: challenge_id } = this.props;
    const { challengeDesc: pipeline_desc } = this.state;
    const { createPipeline } = this.props;
    const { pipelines } = this.state;

    createPipeline({
      challenge_id,
      data: {
        title,
        pipeline_desc,
        benchmark,
        color,
        type,
      },
    });

    pipelines.map(pipeline => {
      this.handleBenchmarkOff(pipeline._id);
    });
  };

  removePipeline = () => {
    const { challengeId: challenge_id } = this.props;
    const { deletePipeline } = this.props;
    const { currentPipelineId, pipelines } = this.state;

    deletePipeline({
      challenge_id,
      pipeline_id: currentPipelineId,
    });

    this.setState({
      showDeleteConfirmModal: false,
    });

    if (pipelines.length >= 1) {
      if (pipelines[0]._id !== currentPipelineId) {
        this.handleChangeBenchmark(pipelines[0]._id);
      } else {
        this.handleChangeBenchmark(pipelines[1]._id);
      }
    }
  };

  handleRemovePipeline = pipeline_id => () => {
    this.setState({
      currentPipelineId: pipeline_id,
      showDeleteConfirmModal: true,
    });
  };

  handleClickPlot = (name, rank) => {
    this.tableData = { fullname: name, rank: rank };
    this.setState({
      isPaneOpen: true,
      hasGraph: true,
      suggestions: getDummyProfiles(60, 1),
      tableData: { fullname: name, rank: rank },
    });
  };

  openSnackBarWithObject = message => {
    this.snackBarQueue.push({
      message: message.title,
      feedback: message.feedback,
      key: new Date().getTime(),
    });
    if (this.state.snackBarOpen) {
      this.setState({ snackBarOpen: false });
    } else {
      this.processQueue();
    }
  };

  openSnackBar = title => {
    // push snackbar message to queue
    this.snackBarQueue.push({
      message: title,
      key: new Date().getTime(),
    });

    if (this.state.snackBarOpen) {
      this.setState({ snackBarOpen: false });
    } else {
      this.processQueue();
    }
  };

  processQueue = () => {
    if (this.snackBarQueue.length > 0) {
      this.setState({
        snackBarMessageInfo: this.snackBarQueue.shift(),
        snackBarOpen: true,
      });
    }
  };

  handleSnackBarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackBarOpen: false });
  };

  handleChangeBenchmark = pid => {
    const { curChallenge, updatePipeline } = this.props;

    this.setState({ currentBenchmark: pid });
    updatePipeline({
      challenge_id: curChallenge._id,
      pipeline_id: pid,
      data: {
        benchmark: true,
      },
    });
  };

  handleChangeTalentFunnel = e => {
    this.setState({
      currentTalentFunnel: e.target.value,
    });
  };

  handleBenchmarkOff = pid => {
    const { curChallenge, updatePipeline } = this.props;
    updatePipeline({
      challenge_id: curChallenge._id,
      pipeline_id: pid,
      data: {
        benchmark: false,
      },
    });
  };

  handleSettings = selected => {
    this.setState({ showSettingModal: true });
  };

  handleCopyLink = (pipeline_id, pipeline_type) => () => {
    const { challengeId } = this.props;
    let link;

    if (pipeline_type === 'External') {
      link = `${window.location.host}/landing/${challengeId}/${pipeline_id}`;
    } else {
      link = `${window.location.host}/enter/${challengeId}/${pipeline_id}`;
    }

    copy(link);
  };

  handleClickTitle = event => {
    event.stopPropagation();
  };

  handleTrackChange = event => {
    const { curChallenge, updateChallenge } = this.props;

    if (curChallenge) {
      const title = curChallenge.test_name;
      const curTitle = event.target.value;

      if (title !== curTitle) {
        updateChallenge({
          challengeId: curChallenge._id,
          data: {
            test_name: curTitle,
          },
        });
      }
    }
  };

  handleBlurDesc = event => {
    const { curChallenge, updateChallenge } = this.props;

    if (curChallenge) {
      const note = curChallenge.test_note;
      const newNote = event.target.value;

      if (note !== newNote) {
        updateChallenge({
          challengeId: curChallenge._id,
          data: {
            test_note: newNote,
          },
        });
      }
    }
  };

  handleUpdatePipelineTitle = (pipeline_id, isDummy) => event => {
    if (isDummy) {
      let newTitles = this.state.dummyPipelineTitles;

      newTitles[pipeline_id] = event.target.value;

      this.setState({
        dummyPipelineTitles: newTitles,
      });

      return;
    }
    const { curChallenge, updatePipeline } = this.props;
    const curTitle = event.target.value;
    if (!curChallenge) {
      return;
    }

    updatePipeline({
      challenge_id: curChallenge._id,
      pipeline_id,
      data: {
        title: curTitle,
      },
    });
  };

  handleChangePageTab = (event, value) => {
    this.setState({ selected: value });
  };

  handleSelectPipeline = pipeline => {
    this.handleChangePageTab(null, 0);
  };

  handleChangeFilterValue = pid => filterValue => {
    const currentSearchPipelineId = pid;
    this.setState({ filterValue, currentSearchPipelineId });
  };

  changeSelectedUser = user => {
    const { selectedUsers } = this.state;
    const existUser = selectedUsers.findIndex(item => item.id === user.id);
    if (existUser >= 0 && !user.isChecked) {
      selectedUsers.splice(existUser, 1);
    } else if (existUser < 0 && user.isChecked) {
      selectedUsers.push(user);
    }
    this.setState({ selectedUsers });
  };

  unSelectedUser = user => {
    const { selectedUsers } = this.state;
    const existUser = selectedUsers.findIndex(item => item.id === user.id);
    selectedUsers.splice(existUser, 1);
    this.setState({ selectedUsers });
  };

  /**
   * Select bubble and set data to detail modal
   */
  selectBubble = point => {
    this.pipelineRef.current.focus();
    this.setState({
      currentBubble: point,
      showBubbleDetailModal: true,
    });
  };

  onDelete = event => {
    const { curChallenge } = this.props;
    this.setState({ showCardDeleteModal: true, curChallenge });
  };

  hideTestCardDeleteModal = () => {
    this.setState({ showCardDeleteModal: false });
  };

  handleConfirmDelete = () => {
    const { deleteChallenge } = this.props;
    const { challengeId } = this.state;

    this.setState({ showCardDeleteModal: false });
    deleteChallenge(challengeId);
    this.props.history.push(`/dashboard`);
  };

  handleClickIcon = pid => (cId, type) => {
    const { updateCandidate, getChallenge } = this.props;
    const { challengeId } = this.state;

    updateCandidate({
      challengeId,
      pipelineId: pid,
      userId: cId,
      data: {
        state: type,
      },
    });
    getChallenge(challengeId);

    this.setState(prevState => ({
      isChangedUserState: !prevState.isChangedUserState,
    }));
  };

  handleClickBackButton = () => {
    let { selected } = this.state;
    if (selected !== 2) {
      this.props.history.push(`/dashboard`);
    } else {
      this.setState({
        selected: 0,
        curEmail: '',
        curPipeIdx: -1,
      });
    }
  };

  getTitle = str => {
    const index = str[0].indexOf('-');
    const title = str[0].slice(0, index);

    return title;
  };

  handleSeeMore = () => {
    this.setState({
      scatterSeeMore: true,
    });
  };

  filterCategories = categories => {
    const top5Categories = categories.sort((a, b) => {
      if (a.tp_avg < b.tp_avg) {
        return 1;
      } else if (a.tp_avg > b.tp_avg) {
        return -1;
      } else {
        return 0;
      }
    });

    if (this.state.scatterSeeMore) {
      return categories;
    }

    return top5Categories.slice(0, 5);
  };

  handleChangePipeline = e => {
    this.setState({
      curPipeline: e.target.value,
    });
  };

  handleSelectUserSliderPane = user => {
    const { firstname, lastname, rank, score, email, _id } = user;
    const { pipelineResult } = this.props;
    let pipelines = [];

    for (let i = 0; i < pipelineResult.length; i += 1) {
      for (let j = 0; j < pipelineResult[i].users.length; j += 1) {
        if (pipelineResult[i].users[j]._id === _id) {
          pipelines = pipelineResult[i];
          break;
        }
      }
    }

    this.setState({
      tableData: { fullname: `${firstname} ${lastname}`, rank, score },
      curEmail: email,
      curPipelineResult: pipelines,
    });
  };

  render() {
    console.log('rendering talent page');

    Modal.setAppElement(this.el);

    const { curChallenge, user } = this.props;
    const { selected, pipelines, challengeId, challenge } = this.state;

    if (selected === INSIGHT_TAB) {
      return <Insight challengeId={challengeId} />;
    }

    const isFullScreenPipeline = true;
    let allUsers = [];
    pipelines &&
      pipelines.map(pipeLine => {
        const { users } = pipeLine;
        allUsers = allUsers.concat(users);
      });

    if (challenge === null) {
      return '';
    }

    if (challenge.status === 'deleted') {
      return <NotFound />;
    }

    let progressStep = 1;
    pipelines.forEach(item => {
      if (progressStep === 2) {
        return;
      }
      if (item.users.length >= 50) {
        progressStep = 2;
      }
    });

    const faqLink = `https://nugget.ai/faq`;

    return (
      <Fragment>
        <Grid container className="result_wrapper">
          <Grid container spacing={32}>
            <Grid item xs={12}>
              <div className="navigation result-header">
                <div className="result-pageTab">
                  <Link to="/dashboard">
                    <span>Challenges</span>
                  </Link>
                  <span>/ {challenge.test_name} /</span>
                  <span className="result-tab-indicator">Talents</span>
                </div>
                <div className="result-toolbar">
                  <div className="result-tools">
                    <AnouncementButton />
                    <a href={faqLink} target="_blank" rel="noopener noreferrer">
                      <Tooltip title="FAQ">
                        <IconButton>
                          <FaqIcon />
                        </IconButton>
                      </Tooltip>
                    </a>
                    <NotificationButton />
                  </div>
                  {user && user.isVerified && (
                    <div className="profile__but" eventkey={6}>
                      <Button href="/setting" className="btn-name">
                        <Picture
                          src={getAvatarPath(user.image) || DefaultAvatar}
                        />
                        &nbsp; &nbsp;
                        <Typography noWrap>
                          <strong>
                            {this.context.t('hi-{name}', {
                              name: user.firstname,
                            })}
                          </strong>
                        </Typography>
                        !
                      </Button>
                    </div>
                  )}
                  {(!user || !user.isVerified) && (
                    <Link to="/">
                      <Button className="register_but" eventkey={6}>
                        {this.context.t('register-login')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Grid>
            {/* <Grid className="challenge" item xs={12} md={6}>
              <TextField
                className="challenge_title"
                onClick={this.handleClickTitle}
                onBlur={this.handleTrackChange}
                defaultValue={this.context.t(challenge.test_name)}
                InputProps={{
                  className: 'challenge_input',
                  endAdornment: <InputAdornment position="end" />,
                }}
                variant="outlined"
                underline={false}
              />
              <Typography className="challenge_timestamp" component="p">
                Created{' '}
                {challenge.createdAt
                  ? moment(challenge.createdAt).format('MMM Do YY')
                  : 'July 10, 2018'}
              </Typography>
              <textarea
                className="challenge_desc"
                onBlur={this.handleBlurDesc}
                placeholder="This is your notepad, feel free to take notes!"
              >
                {curChallenge
                  ? curChallenge.test_note
                  : 'This is your notepad, feel free to take notes!'}
              </textarea>
            </Grid> */}
            <Grid className="challenge" item xs={12} md={6}>
              <Typography component="div" className="talent-title">
                Your Talent Pipelines
              </Typography>
              <Grid className="pipelines-info" item>
                <Grid container spacing={16}>
                  {pipelines.map((pipeline, index) => {
                    return (
                      <Grid item xs={4} key={index}>
                        <InfoCard
                          headerColor={pipeline.color}
                          pipeline={pipeline}
                          onRemove={this.handleRemovePipeline(pipeline._id)}
                          changeBenchmark={this.handleChangeBenchmark}
                          openSnackBar={this.openSnackBar}
                          handleSettings={this.handleSettings}
                          benchmark={pipeline.benchmark}
                          isFullScreenPipeline={isFullScreenPipeline}
                          copyLink={this.handleCopyLink(
                            pipeline._id,
                            pipeline.type,
                          )}
                          pid={index}
                          onSelectPipleLine={this.handleSelectPipeline}
                        />
                      </Grid>
                    );
                  })}
                  <Grid item xs={4}>
                    <InfoCard headerColor="white" renderChild={true}>
                      <div className="addIcon">
                        <Fab
                          color="primary"
                          className="addButton"
                          aria-label="Add"
                          size="small"
                          onClick={this.handleClickAddPipeline}
                        >
                          <Add />
                        </Fab>
                      </div>
                    </InfoCard>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {
            <>
              <Grid className="pipeline_wrapper" container spacing={40}>
                {pipelines.map((pipeline, index) => {
                  const { users } = pipeline;
                  const { currentSearchPipelineId } = this.state;
                  const filteredData =
                    currentSearchPipelineId == pipeline._id
                      ? users.filter(user =>
                          user.fullname
                            .toLowerCase()
                            .includes(this.state.filterValue),
                        )
                      : users;
                  return (
                    <Grid item xs={12} md={6} key={index}>
                      <PipeLine
                        id={index}
                        title={pipeline.title}
                        pipelineType={pipeline.type}
                        userData={filteredData}
                        width={12}
                        color={pipeline.color}
                        onRemove={this.handleRemovePipeline(pipeline._id)}
                        changeBenchmark={() => {
                          this.handleChangeBenchmark(pipeline._id);
                        }}
                        openSnackBar={this.openSnackBar}
                        handleSettings={this.handleSettings}
                        handleUpdateTitle={this.handleUpdatePipelineTitle(
                          pipeline._id,
                        )}
                        benchmark={pipeline.benchmark}
                        isFullScreenPipeline={isFullScreenPipeline}
                        copyLink={this.handleCopyLink(
                          pipeline._id,
                          pipeline.type,
                        )}
                        pid={index}
                        expanded
                        onClickIcon={this.handleClickIcon(pipeline._id)}
                        onChangeFilterValue={this.handleChangeFilterValue(
                          pipeline._id,
                        )}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          }
        </Grid>
        <Footer />
        <AddPipelineModal
          show={this.state.showPipModal}
          onAdd={this.handleAddPipeline}
          onCancel={() => this.setState({ showPipModal: false })}
        />
        <ChartDetailModal
          data={this.state.currentBubble}
          isShow={this.state.showBubbleDetailModal}
          onClose={() => {
            this.setState({ showBubbleDetailModal: false });
          }}
        />
        <ConfirmModal
          onConfirm={this.handleConfirmDelete}
          content={this.context.t('are-you-sure-you-want-to-delete-this')}
          confirmText={this.context.t('delete')}
          isOpened={this.state.showCardDeleteModal}
          onCancel={this.hideTestCardDeleteModal}
        />
        <ConfirmModal
          data={this.state.currentBubble}
          onConfirm={this.removePipeline}
          content={this.context.t('are-you-sure-you-want-to-delete-this')}
          confirmText={this.context.t('delete')}
          isOpened={this.state.showDeleteConfirmModal}
          onCancel={() => {
            this.setState({ showDeleteConfirmModal: false });
          }}
        />
        <TableDataSetting
          show={this.state.showSettingModal}
          pipelines={pipelines}
          onCancel={() => this.setState({ showSettingModal: false })}
        />

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={6000}
          open={this.state.snackBarOpen}
          onExited={this.processQueue}
          onClose={this.handleSnackBarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
            <span id="message-id">
              {!this.state.snackBarMessageInfo.feedback
                ? 'Successfully copied invite link to '
                : ''}

              <b> {this.state.snackBarMessageInfo.message}</b>
            </span>
          }
        />
      </Fragment>
    );
  }
}

DemoTalent.contextTypes = {
  t: PropTypes.func,
};

DemoTalent.propTypes = {
  getChallenge: PropTypes.func.isRequired,
  createPipeline: PropTypes.func.isRequired,
  deletePipeline: PropTypes.func.isRequired,
  updateChallenge: PropTypes.func.isRequired,
  updatePipeline: PropTypes.func.isRequired,
  updateCandidate: PropTypes.func.isRequired,
  curChallenge: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  deleteChallenge: PropTypes.func.isRequired,
  getCandidate: PropTypes.func.isRequired,
  candidate: PropTypes.object,
  challengeId: PropTypes.string.isRequired,
  getPipelinesRequest: PropTypes.func,
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  curChallenge: state.challengeReducer.curChallenge,
  isLoading: state.challengeReducer.isLoading,
  candidate: state.candidateReducer.candidate,
  pipelineResult: state.adminReducer.pipelines,
});

const mapDispatchToProps = {
  getChallenge,
  updateChallenge,
  createPipeline,
  deletePipeline,
  updatePipeline,
  deleteChallenge,
  updateCandidate,
  getCandidate,
  getPipelinesRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(DemoTalent);
