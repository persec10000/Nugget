import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import moment from 'moment';
import copy from 'copy-to-clipboard';

import { Add, ArrowBack } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  Grid,
  Typography,
  Snackbar,
  TextField,
  InputAdornment,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';

import '../Results.scss';
import { PageTabs, PageTab } from './Result.styled';

import { candidateList } from '../../../airtable/candidate';
import { digitalList } from '../../../airtable/digital';
import {
  bubbleData,
  getSkillCategories,
  getHighlights,
} from '../../../airtable/general';
import { ScatterPlot } from '../../Charts/Charts';
import { BubbleChart } from '../../Charts/BubbleChart';
import adminActions from '../../../redux/admin/actions';

import SliderPane from '../../../components/SliderPane';
import AddPipelineModal from '../../../components/Modals/AddPipelineModal';
import ChartDetailModal from '../../../components/Modals/ChartDetailModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import InfoCard from '../../../components/InfoCard';
import TableDataSetting from '../../../components/Modals/TableDataSetting';
import Footer from '../../../components/Footer/Footer';
import getDummyProfiles from '../dummyProfiles';
import SettingMenu from '../SettingMenu';
import TalentFunnel from '../TalentFunnel';
import TeamDynamic from '../TeamDynamic';
import NotFound from '../../NotFound/NotFound';
import { Talent } from '.';

const { getPipelinesRequest } = adminActions;

const TALENT_TAB = 0;

class InsightResult extends Component {
  constructor(props) {
    super(props);

    this.bubbleChartRef = React.createRef();
    this.pipelineRef = React.createRef();

    const { challengeId } = props;

    this.state = {
      selected: 1,
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
      currentPipeline: 0,
      userRange: 0,
      digitalCandidates: [],
      challengeId,
      candidates: [],
      talentCandidates: [],
      externalCandidates: [],
      challenge: {
        test_name: 'Demo',
      },
      pipelines: [],
      scatterAxis: { x: { title: '' }, y: { title: '' } },
      selectedUsers: [],
      currentBubble: {},
      showDeleteConfirmModal: false,
      currentPipelineId: 0,
      dummyPipelineTitles: ['Employees', 'Candidates'],
      dummyPipelineType: ['Internal', 'External'],
      bubbleChartData: [],
      skillCategories: [],
      skillCategoriesData: [],
      pipelineAverageData: {},
      simulatedPipelineIndex: 0,
      simulatedData: [],
      progressStep: 1,
      showCardDeleteModal: false,
      isChangedUserState: false,
      curEmail: '',
      curPipeIdx: -1,
      scatterSeeMore: false,
      curPipeline: 0,
      curUser: {},
      highlightsData: [],
      showEmployees: true,
      showCandidates: true,
    };
    this.tableData = {
      fullname: '',
      score: 0,
    };
    this.snackBarQueue = [];
  }

  componentDidMount = async () => {
    Modal.setAppElement(this.el);
    const { challengeId, getPipelinesRequest } = this.props;

    await this.initData();
    getPipelinesRequest(challengeId);
  };

  async initData() {
    const bubbleChartData = await bubbleData({});
    const skillCategoriesData = await getSkillCategories();
    const externalCandidates = await candidateList(
      { pageSize: 85 },
      skillCategoriesData,
    );
    const digitalCandidates = await digitalList(
      { pageSize: 57 },
      skillCategoriesData,
    );
    const highlightsData = await getHighlights();
    const skillCategories = [];

    skillCategoriesData.forEach(item => skillCategories.push(item.label));

    let candidateScores = [0, 0, 0, 0];
    externalCandidates.forEach(item => {
      candidateScores.forEach((score, key) => {
        candidateScores[key] += Number(item[`skill_${key + 1}`]);
      });
    });

    let digitalScores = [0, 0, 0, 0];
    digitalCandidates.forEach(item => {
      digitalScores.forEach((score, key) => {
        digitalScores[key] += Number(item[`skill_${key + 1}`] || 0);
      });
    });

    const pipelines = [
      {
        _id: 0,
        color: '#552c84',
        users: digitalCandidates,
        title: 'Employees',
      },
      {
        _id: 1,
        color: '#fc8e7f',
        users: externalCandidates,
        title: 'Candidates',
      },
    ];
    this.setState({
      externalCandidates,
      digitalCandidates,
      bubbleChartData,
      candidates: externalCandidates,
      filteredCandidates: externalCandidates,
      talentCandidates: externalCandidates,
      candidateScores,
      digitalScores,
      skillCategories,
      skillCategoriesData,
      pipelines,
      highlightsData,
    });
  }

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

  handleClickAddPipeline = () => {
    this.setState({ showPipModal: true });
  };

  showSlidePane = (hasGraph, users) => (name, rank, score, email, uuid) => {
    let dummyUsers = [];

    this.tableData = { fullname: name, rank, score };
    this.state.pipelines.forEach(pipeline => {
      dummyUsers = [...dummyUsers, ...pipeline.users];
    });

    const { pipelineResult } = this.props;
    let curUser = {};

    pipelineResult.forEach(pipeline => {
      pipeline.users &&
        pipeline.users.forEach(userData => {
          if (userData.uuid === uuid) {
            curUser = userData;
          }
        });
    });

    this.setState({
      isPaneOpen: true,
      hasGraph,
      suggestions: dummyUsers,
      tableData: { fullname: name, rank, score },
      curEmail: email,
      curUserId: uuid,
      curPipeIdx: uuid,
      curUser,
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
    this.setState({ currentBenchmark: pid });
  };

  handleChangeTalentFunnel = e => {
    this.setState({
      currentTalentFunnel: e.target.value,
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

  handleChangeFilterValue = filterValue => {
    this.setState({ filterValue });
  };

  handleChangePageTab = (event, value) => {
    this.setState({ selected: value });
  };

  handleSelectPipeline = pipeline => {
    this.handleChangePageTab(null, 0);
  };

  getFilteredCandidates = candidates => {
    const { filterValue } = this.state;

    return candidates.filter(
      user =>
        user.firstname.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.lastname.toLowerCase().includes(filterValue.toLowerCase()),
    );
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

  hideTestCardDeleteModal = () => {
    this.setState({ showCardDeleteModal: false });
  };

  handleClickIcon = pid => (cId, type) => {
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

  render() {
    console.log('rendering insight page');

    Modal.setAppElement(this.el);

    const { challengeId } = this.props;
    const {
      selected,
      hasGraph,
      digitalCandidates,
      externalCandidates,
      pipelines,
      challenge,
      showEmployees,
      showCandidates,
    } = this.state;

    if (selected === TALENT_TAB) {
      return <Talent challengeId={challengeId} />;
    }

    let allUsers = [];
    const isFullScreenPipeline = true;
    let isEmpty = false;

    allUsers.concat(externalCandidates);
    allUsers.concat(digitalCandidates);

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

    console.log('state.curEmail ', this.state.curEmail);
    console.log('state.curUser ', this.state.curUser);
    console.log('props.pipelineResult ', this.props.pipelineResult);

    return (
      <Fragment>
        <Grid container className="result_wrapper">
          <Grid container spacing={32}>
            <Grid item xs={12}>
              <div className="navigation">
                <div className="pageTab">
                  <Fab
                    color="primary"
                    className="backButton"
                    aria-label="Back"
                    size="small"
                    onClick={this.handleClickBackButton}
                  >
                    <ArrowBack />
                  </Fab>
                  {this.state.selected !== 2 && (
                    <PageTabs
                      value={this.state.selected}
                      onChange={this.handleChangePageTab}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="scrollable"
                      scrollButtons="off"
                    >
                      <PageTab label="Talent" />
                      <PageTab label="Insight" />
                    </PageTabs>
                  )}
                </div>
                <SettingMenu onDelete={this.onDelete} />
              </div>
              <hr />
            </Grid>
            <Grid className="challenge" item xs={12} md={6}>
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
                disabled
                placeholder="This is your notepad, feel free to take notes!"
              >
                {'This is your notepad, feel free to take notes!'}
              </textarea>
            </Grid>
            <Grid className="challenge" item xs={12} md={6}>
              <Typography component="div" className="talent-title">
                Your Talent Pipelines
              </Typography>
              <Grid className="pipelines-info" item>
                <Grid container spacing={16}>
                  {
                    <>
                      {showEmployees && (
                        <Grid item xs={4}>
                          <InfoCard
                            headerColor="#552c84"
                            pipeline={{
                              users: externalCandidates,
                              title: this.state.dummyPipelineTitles[0],
                              type: this.state.dummyPipelineType[0],
                            }}
                            changeBenchmark={this.handleChangeBenchmark}
                            openSnackBar={this.openSnackBar}
                            handleSettings={this.handleSettings}
                            benchmark={this.state.currentBenchmark === 0}
                            isFullScreenPipeline={isFullScreenPipeline}
                            copyLink={this.handleCopyLink('test')}
                            pid={0}
                            onSelectPipleLine={this.handleSelectPipeline}
                            isDummy={true}
                          />
                        </Grid>
                      )}
                      {showCandidates && (
                        <Grid item xs={4}>
                          <InfoCard
                            headerColor="#fc8e7f"
                            pipeline={{
                              users: digitalCandidates,
                              title: this.state.dummyPipelineTitles[1],
                              type: this.state.dummyPipelineType[1],
                            }}
                            changeBenchmark={this.handleChangeBenchmark}
                            openSnackBar={this.openSnackBar}
                            handleSettings={this.handleSettings}
                            benchmark={this.state.currentBenchmark === 1}
                            isFullScreenPipeline={isFullScreenPipeline}
                            copyLink={this.handleCopyLink('test')}
                            pid={1}
                            onSelectPipleLine={this.handleSelectPipeline}
                            isDummy={true}
                          />
                        </Grid>
                      )}
                    </>
                  }
                  <Grid item xs={4}>
                    <InfoCard headerColor="white" renderChild={true}>
                      <div className="addIcon">
                        <Fab
                          color="primary"
                          className="addButton"
                          aria-label="Add"
                          size="small"
                          onClick={this.handleClickAddPipeline}
                          disabled
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
              <Grid container spacing={40} />
              <Grid className="relations_wrapper" container spacing={40}>
                <Grid item xs={12}>
                  <ExpansionPanel
                    className="panel-wrapper"
                    elevation={0}
                    defaultExpanded={true}
                  >
                    <ExpansionPanelSummary
                      classes={{
                        content: 'panel-summary-content',
                        expandIcon: 'panel-summary-icon',
                      }}
                      className="panel-summary"
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography className="title" component="p">
                        Team Profile
                      </Typography>
                      <Typography className="sub-title" component="p">
                        Understand top characteristics driving success for your
                        talent pipelines
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="bubble-chart-detail">
                        <div className="bubble-chart-dropdown">
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
                              {this.context.t('Pipeline')}
                            </InputLabel>
                            <Select
                              className="text_field"
                              value={this.state.curPipeline}
                              onChange={this.handleChangePipeline}
                              input={
                                <OutlinedInput
                                  className="select-label-input"
                                  labelWidth={60}
                                  name="lang"
                                  placeholder="lang"
                                  id="function-customized-select"
                                  inputRef={this.pipelineRef}
                                />
                              }
                            >
                              <MenuItem value={0}>
                                {this.state.dummyPipelineTitles[0]}
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <Typography className="bubble-skill" component="p">
                            {this.state.bubbleChartData.length} Skills
                          </Typography>
                        </div>
                        <div
                          className="bubble-chart-container"
                          ref={this.bubbleChartRef}
                        >
                          <BubbleChart
                            data={this.state.bubbleChartData}
                            onSelectBubble={this.selectBubble}
                            className="bubble-chart-graph"
                          />
                        </div>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
                <Grid item xs={12}>
                  <ExpansionPanel
                    className="panel-wrapper"
                    elevation={0}
                    defaultExpanded={true}
                  >
                    <ExpansionPanelSummary
                      classes={{
                        content: 'panel-summary-content',
                        expandIcon: 'panel-summary-icon',
                      }}
                      className="panel-summary"
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography className="title" component="p">
                        Skills Relationships
                      </Typography>
                      <Typography className="sub-title" component="p">
                        Uncover hidden relationships between your talent pool.
                        Drag the skill to the axis to see how your talent
                        compares
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <ScatterPlot
                        onClickPlot={this.handleClickPlot}
                        stepvalue={1}
                        data={this.state.pipelines}
                        categories={this.filterCategories(
                          this.state.skillCategoriesData,
                        )}
                        onClickSeeMore={this.handleSeeMore}
                        needSeeMore={this.state.skillCategoriesData.length > 5}
                        isDummyData
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
                <Grid item xs={12}>
                  <ExpansionPanel
                    className="panel-wrapper"
                    elevation={0}
                    defaultExpanded={true}
                  >
                    <ExpansionPanelSummary
                      classes={{
                        content: 'panel-summary-content',
                        expandIcon: 'panel-summary-icon',
                      }}
                      className="panel-summary"
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography className="title" component="p">
                        Talent Funnel
                      </Typography>
                      <Typography className="sub-title" component="p">
                        Discover your talent ranked on the challenge. Select a
                        category to see the results
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div className="bubble-chart-detail">
                        <div className="bubble-chart-dropdown">
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
                              {this.context.t('Pipeline')}
                            </InputLabel>
                            <Select
                              className="text_field"
                              value={this.state.currentTalentFunnel}
                              onChange={this.handleChangeTalentFunnel}
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
                              <MenuItem value={1}>
                                {this.state.dummyPipelineTitles[1]}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <TalentFunnel
                          pipelines={this.state.pipelines}
                          benchmark={this.state.currentTalentFunnel}
                          showSlide={this.showSlidePane(true, allUsers)}
                          onClickIcon={this.handleClickIcon()}
                        />
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
                <Grid item xs={12}>
                  <ExpansionPanel
                    className="panel-wrapper"
                    elevation={0}
                    defaultExpanded={true}
                  >
                    <ExpansionPanelSummary
                      classes={{
                        content: 'panel-summary-content',
                        expandIcon: 'panel-summary-icon',
                      }}
                      className="panel-summary"
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography className="title" component="p">
                        Team Dynamic
                      </Typography>
                      <Typography className="sub-title" component="p">
                        Enhance your team performance by simulating how
                        individuals from other pipelines contribute to your
                        team. Mix and match to optimize for performance
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <TeamDynamic
                        pipelines={this.state.pipelines}
                        skillCategories={this.state.skillCategories}
                        benchmark={this.state.currentTalentFunnel}
                        showSlide={this.showSlidePane(true, allUsers)}
                        onClickIcon={this.handleClickIcon()}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
            </>
          }
        </Grid>
        <Footer />
        {pipelines.length > 0 && (
          <SliderPane
            isOpen={this.state.isPaneOpen}
            title=""
            subtitle=""
            onSearch={this.handleChangeFilterValue}
            paneType={false}
            suggestions={this.state.suggestions}
            tableData={this.state.tableData}
            onClose={() => {
              this.setState({ isPaneOpen: false }); // eslint-disable-line
            }}
            hasGraph={hasGraph}
            chartData={this.state.pipelineAverageData}
            skillCategories={this.state.skillCategories}
            skillCategoriesData={this.state.skillCategoriesData}
            pipelines={this.state.pipelines}
            openSnackBar={this.openSnackBarWithObject}
            userEmail={this.state.curEmail}
            uuid={this.state.curUserId}
            userData={this.state.curUser}
            onSearchSelect={this.handleSelectUserSliderPane}
            highlightsData={this.state.highlightsData}
            pipelineType={this.state.dummyPipelineType[this.state.curPipeIdx]}
            temp={challengeId === '5d50a2e27111090c9cf0ac9e'}
            isDummyData
          />
        )}
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

InsightResult.contextTypes = {
  t: PropTypes.func,
};

InsightResult.propTypes = {
  challengeId: PropTypes.string,
  pipelineResult: PropTypes.array.isRequired,
  getPipelinesRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  pipelineResult: state.adminReducer.pipelines,
});

const mapDispatchToProps = {
  getPipelinesRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InsightResult);
