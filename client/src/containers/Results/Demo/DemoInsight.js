import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import assessdata from '../../../static/convertcsv.json';
import minutesdata from '../../../static/minutes.json';

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
  Button,
  IconButton,
  Tooltip,
} from '@material-ui/core';

import { ArrowBack } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import FaqIcon from '@material-ui/icons/LibraryBooks';
import { getAvatarPath } from '../../../utils/userUtil';
import Picture from '../../../components/AvatarMini';
import NotificationButton from '../../../components/NotificationButton';
import AnouncementButton from '../../../components/AnouncementButton';
import DefaultAvatar from '../../../images/characters/04-character.png';

import '../Results.scss';
import { PageTabs, PageTab } from '../Pages/Result.styled';

import {
  getEmployees,
  getCandidates,
  getSkills,
  getHighlights,
  getDataVis,
} from '../../../airtable/demo';

import { ScatterPlot } from '../../Charts/Charts';
import { BubbleChart } from '../../Charts/BubbleChart';
import adminActions from '../../../redux/admin/actions';

import SliderPane from '../../../components/SliderPane';
import ChartDetailModal from '../../../components/Modals/ChartDetailModal';
import ConfirmModal from '../../../components/Modals/ConfirmModal';
import AnalyticsCard from '../../../components/AnalyticsCard';
import TableDataSetting from '../../../components/Modals/TableDataSetting';
import Footer from '../../../components/Footer/Footer';
import getDummyProfiles from '../dummyProfiles';
import SettingMenu from '../SettingMenu';
import TalentFunnel from '../TalentFunnel';
import TeamDynamic from '../TeamDynamic';
import NotFound from '../../NotFound/NotFound';
import Talent from './DemoTalent';

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
      employees: [],
      candidates: [],
      challengeId,
      challenge: {
        test_name: 'Add your title here',
      },
      pipelines: [],
      selectedUsers: [],
      currentBubble: {},
      showDeleteConfirmModal: false,
      currentPipelineId: 0,
      dummyPipelineType: ['Internal', 'External'],
      legends: [],
      colors: [],
      skills: [],
      skillCategories: [],
      curUserValues: [],
      pipelineAverageData: {},
      showCardDeleteModal: false,
      curEmail: '',
      curPipeIdx: -1,
      scatterSeeMore: false,
      curUser: {},
      highlightsData: [],
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
    const employees = await getEmployees();
    const candidates = await getCandidates();
    const { skills, skillCategories } = await getSkills();
    const highlightsData = await getHighlights();
    const { legends, colors } = await getDataVis();
    console.log('employees: ', employees);
    console.log('candidates: ', candidates);
    console.log('legends: ', legends);

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
      skills,
      skillCategories,
      pipelines,
      highlightsData,
      legends,
      colors,
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

  showSlidePane = (hasGraph, users) => (name, rank, email, uuid, userData) => {
    let dummyUsers = [];

    this.tableData = { fullname: name, rank, data: userData };
    this.state.pipelines.forEach(pipeline => {
      dummyUsers = [...dummyUsers, ...pipeline.users];
    });

    const { pipelineResult } = this.props;
    let curUser = {};
    let curPipeIdx = 0;
    pipelineResult.forEach((pipeline, index) => {
      pipeline &&
        pipeline.users &&
        pipeline.users.forEach(user => {
          if (user._id === uuid) {
            curUser = user;
            curPipeIdx = index;
          }
        });
    });

    this.setState({
      isPaneOpen: true,
      hasGraph,
      suggestions: dummyUsers,
      tableData: this.tableData,
      curEmail: email,
      curUserId: uuid,
      curPipeIdx,
      curUser,
      curUserValues: userData,
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
      if (a.employeesAvgValue < b.employeesAvgValue) {
        return 1;
      } else if (a.employeesAvgValue > b.employeesAvgValue) {
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

  render() {
    console.log('Hello insight page');

    Modal.setAppElement(this.el);

    const { challengeId, user } = this.props;
    const {
      selected,
      hasGraph,
      candidates,
      employees,
      pipelines,
      challenge,
      legends,
      colors,
      skills,
    } = this.state;

    if (selected === TALENT_TAB) {
      return <Talent challengeId={challengeId} />;
    }

    let allUsers = [];
    const isFullScreenPipeline = true;

    allUsers.concat(employees);
    allUsers.concat(candidates);

    if (challenge.status === 'deleted') {
      return <NotFound />;
    }

    const chartData = [];
    legends.forEach((legendLabel, index) => {
      const data = skills.map(skill => skill[legendLabel] * 100);
      chartData.push({
        name: legendLabel,
        data,
        pointPlacement: 'on',
        color: colors[index],
        count: 1,
      });
    });

    console.log('state.curEmail ', this.state.curEmail);
    console.log('state.curUser ', this.state.curUser);
    console.log('props.pipelineResult ', this.props.pipelineResult);

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
                  <span>/ Demo /</span>
                  <span className="result-tab-indicator">Insights</span>
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
            <Grid className="challenge" item xs={12} md={12}>
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
              {/* <textarea
                className="challenge_desc"
                onBlur={this.handleBlurDesc}
                disabled
                placeholder="This is your notepad, feel free to take notes!"
              >
                {'This is your notepad, feel free to take notes!'}
              </textarea> */}
            </Grid>
            {/* 
            <Grid className="challenge" item xs={12} md={6}>
              <Typography component="div" className="talent-title">
                Assessments
              </Typography>
              <Grid className="pipelines-info" item>
                <Grid container spacing={16}>
                  {
                    <>
                      <Grid item xs={4}>
                        <InfoCard
                          headerColor="#552c84"
                          pipeline={{
                            users: employees,
                            title: 'Employees',
                            type: 'Internal',
                          }}
                          changeBenchmark={this.handleChangeBenchmark}
                          openSnackBar={this.openSnackBar}
                          handleSettings={this.handleSettings}
                          benchmark={this.state.currentBenchmark === 0}
                          isFullScreenPipeline={isFullScreenPipeline}
                          copyLink={this.handleCopyLink('test')}
                          pid={0}
                          onSelectPipleLine={this.handleSelectPipeline}
                          isDummy
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <InfoCard
                          headerColor="#fc8e7f"
                          pipeline={{
                            users: candidates,
                            title: 'Candidates',
                            type: 'External',
                          }}
                          changeBenchmark={this.handleChangeBenchmark}
                          openSnackBar={this.openSnackBar}
                          handleSettings={this.handleSettings}
                          benchmark={this.state.currentBenchmark === 1}
                          isFullScreenPipeline={isFullScreenPipeline}
                          copyLink={this.handleCopyLink('test')}
                          pid={1}
                          onSelectPipleLine={this.handleSelectPipeline}
                          isDummy
                        />
                      </Grid>
                    </>
                  }
                </Grid>
              </Grid>
            </Grid>
 */}
            <Grid className="challenge" item xs={12} md={12}>
              <Grid className="pipelines-info" item>
                <Grid className="pipe-grid" container spacing={16}>
                  {
                    <>
                      <Grid item xs={4} lg={3} md={3} sm={4}>
                        <AnalyticsCard
                          pipeline={{
                            users: employees,
                            title: 'Assessments',
                            type: 'Internal',
                            length: 120,
                            color: '#448bca',
                          }}
                          data={assessdata}
                          changeBenchmark={this.handleChangeBenchmark}
                          openSnackBar={this.openSnackBar}
                          handleSettings={this.handleSettings}
                          benchmark={this.state.currentBenchmark === 0}
                          isFullScreenPipeline={isFullScreenPipeline}
                          copyLink={this.handleCopyLink('test')}
                          pid={0}
                          onSelectPipleLine={this.handleSelectPipeline}
                          isDummy
                        />
                      </Grid>
                      <Grid item xs={4} lg={3} md={3} sm={4}>
                        <AnalyticsCard
                          pipeline={{
                            users: candidates,
                            title: 'Minutes',
                            type: 'External',
                            length: 1940,
                            color: 'green',
                          }}
                          data={minutesdata}
                          changeBenchmark={this.handleChangeBenchmark}
                          openSnackBar={this.openSnackBar}
                          handleSettings={this.handleSettings}
                          benchmark={this.state.currentBenchmark === 1}
                          isFullScreenPipeline={isFullScreenPipeline}
                          copyLink={this.handleCopyLink('test')}
                          pid={1}
                          onSelectPipleLine={this.handleSelectPipeline}
                          isDummy
                        />
                      </Grid>
                    </>
                  }
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
                              value={0}
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
                              <MenuItem value={0}>Employees</MenuItem>
                            </Select>
                          </FormControl>
                          <Typography className="bubble-skill" component="p">
                            {this.state.skills.length} Skills
                          </Typography>
                        </div>
                        <div
                          className="bubble-chart-container"
                          ref={this.bubbleChartRef}
                        >
                          <BubbleChart
                            data={this.state.skills}
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
                        data={this.state.pipelines}
                        categories={this.filterCategories(this.state.skills)}
                        onClickSeeMore={this.handleSeeMore}
                        needSeeMore={this.state.skillCategories.length > 5}
                        isDummyData={false}
                      />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
                {/* <Grid item xs={12}>
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
                              value={1}
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
                              <MenuItem value={1}>Candidates</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <TalentFunnel
                          pipelines={this.state.pipelines}
                          benchmark={this.state.currentTalentFunnel}
                          showSlide={this.showSlidePane(true, allUsers)}
                        />
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid> */}
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
                        series={chartData}
                        pipelines={this.state.pipelines}
                        skillCategories={this.state.skillCategories}
                        benchmark={this.state.currentTalentFunnel}
                        showSlide={this.showSlidePane(true, allUsers)}
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
            legends={this.state.legends}
            colors={this.state.colors}
            skillCategories={this.state.skillCategories}
            skillData={this.state.skills}
            userValues={this.state.curUserValues}
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
  user: state.authReducer.user,
  pipelineResult: state.adminReducer.pipelines,
});

const mapDispatchToProps = {
  getPipelinesRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(InsightResult);
