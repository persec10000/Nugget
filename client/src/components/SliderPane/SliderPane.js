import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Avatar,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment-timezone';
import SlidingPane from 'react-sliding-pane';

import 'react-sliding-pane/dist/react-sliding-pane.css';
import './SliderPane.scss';

import AutoSuggest from '../AutoSuggest';
import { PolarSpiderChart } from '../../containers/Charts/Charts';
import ValuePanel from '../ValuePanel';
import LabelChip from '../Chip';
import { getWastonKeywords } from '../../helpers/endpoints/api';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { Result1 } from './rawResult';
import { getHighlightsTemp } from '../../airtable/consultingData';

import logoPng from '../../images/logo/nugget-logo.png';
import whiteLogo from '../../images/logo/logo-white.png';
import { getRandomInt, polarData, pipelinePolarDat, styles } from './data';

class SliderPane extends Component {
  constructor(props, context) {
    super(props, context);
    let skills = [];
    for (let i = 0; i < props.skillCategories.length; i += 1) {
      if (i >= 4) {
        break;
      }
      skills.push({
        value: props.skillCategories[i],
        label: props.skillCategories[i],
      });
    }
    this.state = {
      userType: 1,
      fullname: '',
      score: 0,
      challengeSelected: props.pipelines[0],
      curUser: {},
      curFourSkills: skills,
      keywords: [],
      activeStep: 0,
      dummyDatas: [],
    };
  }

  ReportPDF = () => {
    const now = moment()
      .tz('America/Toronto')
      .format();

    const {
      highlightsData,
      skillData,
      skillCategories,
      pipelines,
      pipelineType,
      isDummyData,
      tableData,
    } = this.props;
    if (!isDummyData) {
      return <></>;
    }
    let closeFive = [];
    if (tableData.rank !== undefined) {
      for (let i = 0; i < pipelines[1].users.length; i += 1) {
        const profileRank = parseInt(pipelines[1].users[i].rank);
        const userRank = parseInt(tableData.rank);
        const closeName = pipelines[1].users[i].fullname;
        if (userRank === 1 && profileRank > 1 && profileRank <= 6) {
          closeFive.push(closeName);
        } else if (
          userRank === 2 &&
          (profileRank === 1 || (profileRank > 2 && profileRank <= 6))
        ) {
          closeFive.push(closeName);
        } else if (
          userRank === pipelines[1].users.length &&
          profileRank >= pipelines[1].users.length - 5 &&
          profileRank <= pipelines[1].users.length - 1
        ) {
          closeFive.push(closeName);
        } else if (
          userRank === pipelines[1].users.length - 1 &&
          ((profileRank >= pipelines[1].users.length - 5 &&
            profileRank <= pipelines[1].users.length - 2) ||
            userRank === pipelines[1].users.length)
        ) {
          closeFive.push(closeName);
        } else if (
          profileRank === userRank - 2 ||
          profileRank === userRank - 1 ||
          (profileRank >= userRank + 1 && profileRank <= userRank + 3)
        ) {
          closeFive.push(closeName);
        }
        if (closeFive.length >= 5) {
          break;
        }
      }
    }
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.body}>
          <View style={styles.header} fixed>
            <Text style={styles.headerLeft}>
              858b6bb0-e8cc-11e9-a282-f198caab968b
            </Text>
            <Text style={styles.headerRight}>{`Demo ${now}`}</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image style={styles.image} src={logoPng} />
          </View>
          <Text style={styles.textLarge}>Assessment Summary</Text>
          <Text style={styles.textSemiLarge}>Prepared for:</Text>
          <Text style={styles.textSemiLarge}>{tableData.fullname}</Text>
        </Page>
        <Page size="A4" orientation="landscape" style={styles.body}>
          <View style={styles.header} fixed>
            <Text style={styles.headerLeft}>
              858b6bb0-e8cc-11e9-a282-f198caab968b
            </Text>
            <Text style={styles.headerRight}>{`Demo ${now}`}</Text>
          </View>
          <Text style={styles.subtitle}>How to interpret the results</Text>
          {pipelineType === 'Internal' && (
            <>
              <Text style={styles.normalText}>
                What we are measuring is the extent to which you can rely on a
                certain set of skills, when you are pressed for time and placed
                in a challenging situation. We are not necessarily measuring how
                good you are at each skill. You can think of this simply like
                how we think about every-day skills; how cooking for one person
                can be more natural and effortless whereas cooking for another
                person can take more time and more attention, but the food
                created by these two people can taste equally good.
              </Text>
              <Text style={styles.normalText}>
                The information contained in this report is not meant to be used
                for performance evaluation or any other decision on its
                entirety. The report is built as a tool for you to use as for
                self-development and give you an interpretation of your response
                of the challenge.
              </Text>
            </>
          )}
          {pipelineType === 'External' && (
            <>
              <Text style={styles.normalText}>
                To guide you through interpreting these results, you can
                understand your overall fit in three ways:
              </Text>
              <View style={styles.tagTextWrapper}>
                <Text style={styles.tagTextDesc}>
                  <Text style={styles.tagText}>Close fit:</Text>
                  Your natural skills greatly overlap with the typical skills of
                  industry professionals.
                </Text>
              </View>
              <View style={styles.tagTextWrapper}>
                <Text style={styles.tagTextDesc}>
                  <Text style={styles.tagText}>Near fit:</Text>
                  Your natural skills have some overlap with the typical skills
                  of industry professionals, but there are some skills of
                  industry professionals that require some degree of focus and
                  effort from you.
                </Text>
              </View>
              <View style={styles.tagTextWrapper}>
                <Text style={styles.tagTextDesc}>
                  <Text style={styles.tagText}>Distant fit:</Text>
                  Most of the typical skills of industry professionals require
                  some degree of focus and effort from you.
                </Text>
              </View>
              <Text style={styles.normalText}>
                What we are measuring is the extent to which you can rely on a
                certain set of skills, when you are pressed for time and placed
                in a challenging situation. We are not necessarily measuring how
                good you are at each skill. You can think of this simply like
                how we think about every-day skills; how cooking for one person
                can be more natural and effortless whereas cooking for another
                person can take more time and more attention, but the food
                created by these two people can taste equally good.
              </Text>
              <Text style={styles.normalText}>
                The information contained in this report is not meant to be used
                for performance evaluation or any other decision on its
                entirety. The report is built as a tool for you to use as for
                self-development and give you an interpretation of your response
                of the challenge.
              </Text>
            </>
          )}
          <Image style={styles.footer} src={logoPng} />
        </Page>
        <Page size="A4" orientation="landscape" style={styles.body}>
          <View style={styles.header} fixed>
            <Text style={styles.headerLeft}>
              858b6bb0-e8cc-11e9-a282-f198caab968b
            </Text>
            <Text style={styles.headerRight}>{`Demo ${now}`}</Text>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableTitle}>Highlights</Text>
            <Text style={styles.normalText}>
              The numbers below represent 4 relevant insights that out model
              identified as relavant to prediction outcomes.
            </Text>
            <View style={styles.tableRow}>
              <View style={styles.tableColFirst}>
                <Text style={styles.tableHeader}>Event</Text>
              </View>
              <View style={styles.tableColSecond}>
                <Text style={styles.tableHeader}>You</Text>
              </View>
              {pipelineType === 'Internal' && (
                <View style={styles.tableColThird}>
                  <Text style={styles.tableHeader}>Employees</Text>
                </View>
              )}
              {pipelineType === 'External' && (
                <View style={styles.tableColFourth}>
                  <Text style={styles.tableHeader}>Industry</Text>
                </View>
              )}
            </View>
            {highlightsData.map((pipelinesData, index) => {
              const { title, desc } = pipelinesData;
              const highlightValue =
                Number(this.props.userValues[title]).toFixed(2) || 0;

              return (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableColFirst}>
                    <Text style={styles.tableTagName}>
                      {this.context.t(title)}
                    </Text>
                    <Text style={styles.tableTagDescription}>
                      {this.context.t(desc)}
                    </Text>
                  </View>
                  <View style={styles.tableColSecond}>
                    <Text style={styles.tableValue}>{highlightValue}</Text>
                  </View>
                  {pipelineType === 'Internal' && (
                    <View style={styles.tableColThird}>
                      <Text style={styles.tableValue}>
                        {pipelinesData.employees}
                      </Text>
                    </View>
                  )}
                  {pipelineType === 'External' && (
                    <View style={styles.tableColFourth}>
                      <Text style={styles.tableValue}>
                        {pipelinesData.candidates}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          <Image style={styles.footer} src={logoPng} />
        </Page>
        <Page size="A4" orientation="landscape" style={styles.body}>
          <View style={styles.header} fixed>
            <Text style={styles.headerLeft}>
              858b6bb0-e8cc-11e9-a282-f198caab968b
            </Text>
            <Text style={styles.headerRight}>{`Demo ${now}`}</Text>
          </View>
          <Text style={styles.subtitle}>Overall Fit</Text>
          {pipelineType === 'External' && (
            <>
              {tableData.rank > 0 && tableData.rank <= 25 && (
                <Text style={styles.normalText}>
                  You are a <Text style={styles.textBold}>close fit</Text> for
                  this function! Your natural skills greatly overlap with the
                  typical skills of industry professionals.
                </Text>
              )}
              {tableData.rank > 25 && tableData.rank <= 75 && (
                <Text style={styles.normalText}>
                  You are a <Text style={styles.textBold}>near fit</Text> for
                  this function! Your natural skills have some overlap with the
                  typical skills of industry professionals, but there are some
                  skills of industry professionals that require some degree of
                  focus and effort from you.
                </Text>
              )}
              {tableData.rank > 75 && tableData.rank <= 100 && (
                <Text style={styles.normalText}>
                  You are a <Text style={styles.textBold}>distant fit</Text> for
                  this function! Most of the typical skills of industry
                  professionals require some degree of focus and effort from
                  you.
                </Text>
              )}
              <View style={styles.tablestyle2}>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableHeaderStyle2}>
                    Your top five talents
                  </Text>
                  <Text style={styles.tableValue2}>Speedy action</Text>
                  <Text style={styles.tableValue2}>Problem identification</Text>
                  <Text style={styles.tableValue2}>Resource organization</Text>
                  <Text style={styles.tableValue2}>Idea generation</Text>
                  <Text style={styles.tableValue2}>Detailed writing</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.tableHeaderStyle2}>
                    Industry top five talents
                  </Text>
                  <Text style={styles.tableValue2}>Active iternation</Text>
                  <Text style={styles.tableValue2}>Speedy action</Text>
                  <Text style={styles.tableValue2}>Content verification</Text>
                  <Text style={styles.tableValue2}>
                    Impactful communication
                  </Text>
                  <Text style={styles.tableValue2}>Idea generation</Text>
                </View>
              </View>
              {closeFive.length === 5 && (
                <>
                  <Text style={styles.overallFooterTitle}>CLOSE-5</Text>
                  <Text style={styles.overallFooterDesc}>
                    You performed similarly to 4 peers in your organization
                  </Text>
                  <Text style={styles.overallFooterNames}>
                    {`${closeFive[0]}    ${closeFive[1]}    ${closeFive[2]}    ${closeFive[3]}    ${closeFive[4]}`}
                  </Text>
                </>
              )}
            </>
          )}
          {pipelineType === 'Internal' && (
            <View style={styles.tablestyle2}>
              <View style={styles.tableColumn}>
                <Text style={styles.tableHeaderStyle3}>
                  Your top five talents
                </Text>
                <Text style={styles.tableValue3}>Speedy action</Text>
                <Text style={styles.tableValue3}>Problem identification</Text>
                <Text style={styles.tableValue3}>Resource organization</Text>
                <Text style={styles.tableValue3}>Idea generation</Text>
                <Text style={styles.tableValue3}>Detailed writing</Text>
              </View>
              <View style={styles.tableColumn}>
                <Text style={styles.tableHeaderStyle3}>
                  Employees top five talents
                </Text>
                <Text style={styles.tableValue3}>Active iternation</Text>
                <Text style={styles.tableValue3}>Speedy action</Text>
                <Text style={styles.tableValue3}>Content verification</Text>
                <Text style={styles.tableValue3}>Impactful communication</Text>
                <Text style={styles.tableValue3}>Idea generation</Text>
              </View>
              <View style={styles.tableColumn}>
                <Text style={styles.tableHeaderStyle3}>
                  Industry top five talents
                </Text>
                <Text style={styles.tableValue3}>Active iternation</Text>
                <Text style={styles.tableValue3}>Resource organization</Text>
                <Text style={styles.tableValue3}>Content verification</Text>
                <Text style={styles.tableValue3}>Idea generation</Text>
                <Text style={styles.tableValue3}>Speedy action</Text>
              </View>
            </View>
          )}
          <Image style={styles.footer} src={logoPng} />
        </Page>
        <Page size="A4" orientation="landscape" style={styles.body}>
          <View style={styles.header} fixed>
            <Text style={styles.headerLeft}>
              858b6bb0-e8cc-11e9-a282-f198caab968b
            </Text>
            <Text style={styles.headerRight}>{`Demo ${now}`}</Text>
          </View>
          <View style={styles.performanceHeader} fixed>
            <Text style={styles.subtitle}>Performance</Text>
            <Text style={styles.normalText}>
              We measured{' '}
              <Text style={styles.textBold}>{skillCategories.length}</Text>{' '}
              competencies driving work performance for your company and
              benchmarked your talents with{' '}
              <Text style={styles.textBold}>Industry</Text> peers. Your talents
              are ordered by your strengths. Scores refer to the percentiles in
              the population. Each score is a number from 1-100, the higher the
              score the more you are able to naturally express the skill.
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow} fixed>
              <View style={styles.tableColFirst}>
                <Text style={styles.tableHeader}>Talents</Text>
              </View>
              <View style={styles.tableColSecond}>
                <Text style={styles.tableHeader}>You</Text>
              </View>
              {pipelineType === 'Internal' && (
                <View style={styles.tableColThird}>
                  <Text style={styles.tableHeader}>Employees</Text>
                </View>
              )}
              {pipelineType === 'External' && (
                <View style={styles.tableColFourth}>
                  <Text style={styles.tableHeader}>Industry</Text>
                </View>
              )}
            </View>
            {skillData.map((data, index) => {
              const { label, employeesAvgValue, industry } = data;
              return (
                <View style={styles.tableRow} key={index} wrap={false}>
                  <View style={styles.tableColFirst}>
                    <Text style={styles.tableTagName}>{label}</Text>
                  </View>
                  <View style={styles.tableColSecond}>
                    <Text style={styles.tableValue}>
                      {tableData.data[label] !== undefined
                        ? Math.round(tableData.data[label] * 100)
                        : 0}
                    </Text>
                  </View>
                  {pipelineType === 'Internal' && (
                    <View style={styles.tableColThird}>
                      <Text style={styles.tableValue}>
                        {Math.round(employeesAvgValue * 100)}
                      </Text>
                    </View>
                  )}
                  {pipelineType === 'External' && (
                    <View style={styles.tableColFourth}>
                      <Text style={styles.tableValue}>
                        {Math.round(industry * 100)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          <Image style={styles.footer} src={logoPng} />
        </Page>
        <Page size="A4" orientation="landscape" style={styles.body}>
          <View style={styles.header} fixed>
            <Text style={styles.headerLeft}>
              858b6bb0-e8cc-11e9-a282-f198caab968b
            </Text>
            <Text style={styles.headerRight}>{`Demo ${now}`}</Text>
          </View>
          <Text style={styles.subtitle} fixed>
            Glossary
          </Text>
          <View style={styles.viewTwoCol}>
            <View style={styles.firstCol}>
              {skillData.map((data, index) => {
                if (index % 2 === 0) {
                  return;
                }
                return (
                  <View style={styles.paragraph} key={index} wrap={false}>
                    <View>
                      <View style={styles.paragraphHeader}>
                        <View
                          style={{
                            ...styles.paragraphCircle,
                            backgroundColor: data.color,
                          }}
                        />
                        <Text style={styles.paragraphTitle}>{data.label}</Text>
                      </View>
                      <Text style={styles.paragraphDesc}>
                        {data.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.firstCol}>
              {skillData.map((data, index) => {
                if (index % 2 === 1) {
                  return;
                }
                return (
                  <View style={styles.paragraph} key={index} wrap={false}>
                    <View>
                      <View style={styles.paragraphHeader}>
                        <View
                          style={{
                            ...styles.paragraphCircle,
                            backgroundColor: data.color,
                          }}
                        />
                        <Text style={styles.paragraphTitle}>{data.label}</Text>
                      </View>
                      <Text style={styles.paragraphDesc}>
                        {data.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <Image style={styles.footer} src={logoPng} fixed />
        </Page>
        <Page size="A4" orientation="landscape" style={styles.bodyLast}>
          <View style={styles.lastPage}>
            <View style={styles.lastPageLeftSide}>
              <Text style={styles.aboutNugget}>About nugget.ai</Text>
              <Text style={styles.descNugget}>
                nugget.ai quantifies people skills to help companies hire and
                develop top talent. We invite employees and candidates to take
                online challenges, specific for different roles, companies and
                industries, and build AI models that combine thousands of data
                points to measure hard and soft skills that correlate to
                performance benchmarks.
              </Text>
              <Text style={styles.aboutNugget}>Got questions?</Text>
              <Text style={styles.descNugget}>Email us at hello@nugget.ai</Text>
            </View>
            <View style={styles.lastPageRightSide}>
              <Image style={styles.logoWhite} src={whiteLogo} />
            </View>
          </View>
        </Page>
      </Document>
    );
  };
  data1 = [
    {
      label: this.context.t('speed'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('meticulousness-assertiveness'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('attention-to-detail'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('clarity-reasoning'),
      value: getRandomInt(100),
    },
  ];
  data2 = [
    {
      label: this.context.t('speed'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('meticulousness-assertiveness'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('attention-to-detail'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('clarity-reasoning'),
      value: getRandomInt(100),
    },
  ];
  data3 = [
    {
      label: this.context.t('speed'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('meticulousness-assertiveness'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('attention-to-detail'),
      value: getRandomInt(100),
    },
    {
      label: this.context.t('clarity-reasoning'),
      value: getRandomInt(100),
    },
  ];

  async componentDidMount() {
    if (this.props.temp) {
      const dummyDatas = await getHighlightsTemp();
      this.setState({ dummyDatas });
    }
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.tableData.fullname !== this.props.tableData.fullname ||
      prevProps.tableData.rank !== this.props.tableData.rank ||
      prevProps.uuid != this.props.uuid
    ) {
      const { userData } = this.props;

      console.log('this.props.userData ', userData);

      const section_text_event =
        userData !== undefined && userData.result_id !== undefined
          ? userData.result_id.event_id.events.section_text_event
          : null;
      let wholeText = '';

      if (section_text_event) {
        Object.keys(section_text_event).map((key, index) => {
          if (index >= 4) {
            section_text_event[key].map(newKey => {
              wholeText += newKey;
            });
          } else {
            wholeText += section_text_event[key];
          }
        });
      }

      if (!this.props.isDummyData) {
        try {
          const { data } = await getWastonKeywords(wholeText);
          const { keywords } = data;

          this.setState({
            keywords,
          });
        } catch (error) {
          console.log('get keyword error: ', error);
        }
      }

      this.setState({
        fullname: this.props.tableData.fullname,
        score: this.props.tableData.rank,
        curUser: userData,
      });
    }
  }

  handleChangeUserType = event => {
    this.setState({ userType: event.target.value });
  };

  handleSearch = event => {
    const { onSearch } = this.props;
    onSearch(event.target.value);
  };

  handleSelectUser = user => {
    this.props.onSearchSelect(user);
  };

  changeChallenge(event) {
    polarData[1] = pipelinePolarDat[event.target.value];
    this.setState({
      challengeSelected: this.props.pipelines.filter(
        c => c.title === event.target.value,
      )[0],
    });
  }

  renderValues = () => {
    let highlightsData;
    if (!this.props.temp) {
      highlightsData = this.props.highlightsData;
    } else {
      highlightsData = this.state.dummyDatas;
    }
    if (highlightsData === undefined) {
      return;
    }
    console.log('dummy------------', highlightsData);

    return highlightsData.map((pipelinesData, index) => {
      const { title, desc } = pipelinesData;
      const highlightValue =
        Number(this.props.userValues[title]).toFixed(2) || 0;

      return (
        <ValuePanel
          title={this.context.t(title)}
          description={this.context.t(desc)}
          value={highlightValue}
          key={index}
          sidepane={true}
          pipelinesData={pipelinesData}
        />
      );
    });
  };

  calcuteAvg = (skillCategories, users) => {
    let scoreAvg = [];
    users.forEach(item => {
      skillCategories.forEach((score, key) => {
        if (!scoreAvg[key]) {
          scoreAvg[key] = 0;
        }
        scoreAvg[key] += Math.abs(Number(item[`skill_${key + 1}`] || 0));
      });
    });
    scoreAvg.forEach((item, key) => {
      scoreAvg[key] = Math.abs(scoreAvg[key]) / users.length;
    });
    return scoreAvg;
  };

  timeToString = sec_number => {
    const sec_num = parseInt(sec_number, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - hours * 3600) / 60);
    let seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };

  handleHighlightKeywords = text => {
    const { keywords } = this.state;
    let highlightedText = text;
    keywords.map(key => {
      highlightedText = highlightedText.replace(key, `<i><b>${key}</b></i>`);
    });
    return highlightedText;
  };

  onChange = (value, { action, removedValue }) => {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        return;
    }
    const fourSkills = value;
    fourSkills.shift();
    this.setState({
      curFourSkills: value,
    });
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleReset = () => {
    this.setState(prevState => ({
      activeStep: 0,
    }));
  };

  render() {
    const {
      title,
      subtitle,
      isOpen,
      onClose,
      tableData,
      suggestions,
      pipelines,
      userData,
      skillCategories,
      skillData,
      legends,
      colors,
      isDummyData,
      userValues,
    } = this.props;
    console.log('suggestions->>>>>>>>>>>>', tableData);

    // HTML text for sections
    let section_html_event;
    let section_text_event;

    console.log('section_html_event >>>>>>>>>>', section_html_event);
    section_text_event =
      this.state.curUser !== undefined &&
      this.state.curUser.result_id !== undefined
        ? this.state.curUser.result_id.event_id.events.section_text_event
        : Result1.text;

    section_html_event =
      this.state.curUser !== undefined &&
      this.state.curUser.result_id !== undefined
        ? this.state.curUser.result_id.event_id.events.section_html_event
        : section_text_event;

    const timeSpent =
      this.state.curUser !== undefined &&
      this.state.curUser.result_id !== undefined
        ? this.state.curUser.result_id.event_id.events.spent_seconds_event
        : null;

    // get total words from the event
    const wordCountEvent =
      this.state.curUser !== undefined &&
      this.state.curUser.result_id !== undefined
        ? this.state.curUser.result_id.event_id.events.word_count_event
        : {};
    let totalWords = 0;
    wordCountEvent &&
      Object.keys(wordCountEvent).forEach(key => {
        totalWords += wordCountEvent[key];
      });

    const timeSpentEvent =
      this.state.curUser !== undefined &&
      this.state.curUser.result_id !== undefined
        ? this.state.curUser.result_id.event_id.events.time_spent_event
        : {};

    const wildCardEvent =
      this.state.curUser !== undefined &&
      this.state.curUser.result_id !== undefined
        ? this.state.curUser.result_id.event_id.events.wild_card_event
        : null;
    const { fullname, challengeSelected } = this.state;
    let level = suggestions.reduce((total, user, currentIndex, arr) => {
      return total + (tableData.rank >= user.rank ? 1 : 0);
    }, 0);
    if ((level / suggestions.length) * 100 < 5) {
      level = 5;
    } else if ((level / suggestions.length) * 100 < 10) {
      level = 10;
    } else if ((level / suggestions.length) * 100 < 20) {
      level = 20;
    } else {
      level = 0;
    }
    polarData[0].name = fullname;
    const userScore = [];
    console.log('userValues: ', userValues);
    if (userValues && skillCategories) {
      skillCategories.forEach(skillLabel => {
        const value = userValues[skillLabel];
        userScore.push(value ? value * 100 : 0);
      });
    }
    let chartData = [];
    let stateChartData = [];

    console.log('legends: ', legends);
    console.log('skillData: ', skillData);
    console.log('userData: ', userData);
    legends.forEach((legendLabel, index) => {
      const data = skillData.map(skill => skill[legendLabel] * 100);

      stateChartData.push({
        name: legendLabel,
        data,
        pointPlacement: 'on',
        color: colors[index],
        count: 1,
      });
    });
    chartData = [
      ...stateChartData,
      {
        name: `${this.props.tableData.fullname}`,
        data: userScore,
        pointPlacement: 'on',
        color: '#00F',
        count: 1,
      },
    ];

    console.log('userScore: ', userScore);
    console.log('chartData: ', chartData);

    // talents data

    const talents = [];

    skillData.map(skill => {
      talents.push({
        label: skill.label,
        description: skill.description,
        value: userValues[skill.label],
      });
    });

    // sort by value
    talents.sort((a, b) => {
      if (a.value < b.value) {
        return 1;
      } else if (a.value > b.value) {
        return -1;
      }

      return 0;
    });

    return (
      <SlidingPane
        className={'SliderPane'}
        overlayClassName={'SliderOverlay'}
        isOpen={isOpen}
        title={title}
        subtitle={subtitle}
        onRequestClose={onClose}
      >
        <div>
          <div className="SlidingPaneContent">
            <div className="SlideHeaderWrapper">
              <AutoSuggest
                onSelect={this.handleSelectUser}
                suggestions={suggestions}
                variant="outlined"
              />
              <div className="SlideHeader">
                <div className="candidate_info">
                  <Typography variant="title">{fullname}</Typography>
                  {/* TODO: Just hided this component temporarly */
                  /* <div className="candidate_timestamp">
                    {tableData.rank !== 'N/A' && (
                      <LabelChip
                        color="primary"
                        avatar={<Avatar>Rank</Avatar>}
                        classes={{
                          root: { width: '130px', backgroundColor: '#928ef3' },
                        }}
                        label={tableData.rank}
                      />
                    )}
                  </div> */}
                  <div className="SlideHeader-icons">
                    {this.state.curUser !== undefined &&
                      this.state.curUser.resumeUrl !== undefined &&
                      this.state.curUser.resumeUrl !== '' &&
                      this.state.curUser.resumeUrl && (
                        <a
                          href={this.state.curUser.resumeUrl}
                          className="resume-link-button"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-file resume-link-image" />
                        </a>
                      )}
                    <a
                      href={`mailto:${
                        this.props.userData !== undefined
                          ? this.props.userData.email
                          : this.props.userEmail
                      }`}
                      className="mail-to-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-envelope mail-to-image" />
                    </a>
                  </div>
                  {isDummyData && (
                    <div className="download-pdf-button-wrapper">
                      <PDFDownloadLink
                        document={<this.ReportPDF />}
                        fileName={`${tableData.fullname}_Demo.pdf`}
                        className="download-pdf-button"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? 'Loading document...' : 'Download report'
                        }
                      </PDFDownloadLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <br />
            <p className="highlight-title">Highlights</p>
            <Grid
              className="values-wrapper"
              container
              xs={12}
              alignItems="center"
              justify="center"
              direction="column"
            >
              <div className="form-data">{this.renderValues()}</div>
            </Grid>
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
                  Response
                </Typography>
                <Typography className="sub-title" component="p" />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className="panel-typography">
                <div className="response-info">
                  <div className="panel-timestamp">
                    <Typography className="title" component="p">
                      Total Time
                    </Typography>
                    {!this.props.isDummyData && (
                      <Typography className="time" component="p">
                        {timeSpent ? this.timeToString(timeSpent) : 'N/A'}
                      </Typography>
                    )}
                    {this.props.isDummyData && (
                      <Typography className="time" component="p">
                        {Result1.timestamp}
                      </Typography>
                    )}
                  </div>
                  <div className="panel-totalwords">
                    <Typography className="title" component="p">
                      Total Words
                    </Typography>
                    {!this.props.isDummyData && (
                      <Typography className="time" component="p">
                        {totalWords}
                      </Typography>
                    )}
                    {this.props.isDummyData && (
                      <Typography className="time" component="p">
                        {178}
                      </Typography>
                    )}
                  </div>
                </div>
                {wildCardEvent && (
                  <div className="panel-wildcard">
                    <div className="panel-wildcard-title">
                      <Typography className="title" component="p">
                        Wild Card
                      </Typography>
                      {wildCardEvent && wildCardEvent.show === 'true' && (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title="Wild cards are timed or random pop-ups during the challenge"
                          placement="right"
                        >
                          <i
                            className="far fa-question-circle question-icon"
                            aria-hidden="true"
                          />
                        </Tooltip>
                      )}
                    </div>
                    <div className="panel-wildcard-content">
                      <p className="panel-wildcard-text">
                        <strong>{wildCardEvent.label || ''}</strong>
                        {' : '}
                        {wildCardEvent.content}
                      </p>
                      <p className="panel-wildcard-time">
                        {wildCardEvent.time}
                      </p>
                    </div>
                  </div>
                )}
                {section_html_event !== undefined
                  ? Object.keys(section_html_event).map((key, index) => {
                      const timeSpentAmount = timeSpentEvent[key] || 0;
                      const sectionWordCount = wordCountEvent[key] || '';

                      if (index === 4) {
                        return section_html_event[key].map(
                          (newSection, index) => {
                            let newKeys = Object.keys(newSection);
                            return (
                              <div className="panel-paragraph" key={index}>
                                <div className="panel-section-text">
                                  <Typography
                                    component="p"
                                    className="panel-typography-title"
                                  >
                                    {newKeys[0].slice(0, newKeys[0].length - 2)}
                                  </Typography>
                                  <Typography
                                    component="p"
                                    className="panel-typography-detail"
                                  >
                                    <span
                                      className="RichEditor-root"
                                      dangerouslySetInnerHTML={{
                                        __html: this.handleHighlightKeywords(
                                          newSection[newKeys[0]],
                                        ),
                                      }}
                                    />
                                  </Typography>
                                </div>
                                <div className="panel-section-info">
                                  <p className="panel-section-info-timespent">
                                    {this.timeToString(timeSpentAmount)}
                                  </p>
                                  <p className="panel-section-info-wordCount">
                                    {`${sectionWordCount} words`}
                                  </p>
                                </div>
                              </div>
                            );
                          },
                        );
                      }
                      return (
                        <div className="panel-paragraph" key={index}>
                          <div className="panel-section-text">
                            <Typography
                              component="p"
                              className="panel-typography-title"
                            >
                              {key.slice(0, key.length - 2)}
                            </Typography>
                            <Typography
                              component="p"
                              className="panel-typography-detail"
                            >
                              <span
                                className="RichEditor-root"
                                dangerouslySetInnerHTML={{
                                  __html: this.handleHighlightKeywords(
                                    section_html_event[key],
                                  ),
                                }}
                              />
                            </Typography>
                          </div>
                          <div className="panel-section-info">
                            <p className="panel-section-info-timespent">
                              {this.timeToString(timeSpentAmount)}
                            </p>
                            <p className="panel-section-info-wordCount">
                              {`${sectionWordCount} words`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : Object.keys(section_text_event).map((key, index) => {
                      const timeSpentAmount = timeSpentEvent[key] || 0;
                      const sectionWordCount = wordCountEvent[key] || '';

                      if (index === 4) {
                        return section_text_event[key].map(
                          (newSection, index) => {
                            let newKeys = Object.keys(newSection);
                            return (
                              <div className="panel-paragraph" key={index}>
                                <div className="panel-section-text">
                                  <Typography
                                    component="p"
                                    className="panel-typography-title"
                                  >
                                    {newKeys[0].slice(0, newKeys[0].length - 2)}
                                  </Typography>
                                  <Typography
                                    component="p"
                                    className="panel-typography-detail"
                                  >
                                    <span
                                      className="RichEditor-root"
                                      dangerouslySetInnerHTML={{
                                        __html: this.handleHighlightKeywords(
                                          newSection[newKeys[0]],
                                        ),
                                      }}
                                    />
                                  </Typography>
                                </div>
                                <div className="panel-section-info">
                                  <p className="panel-section-info-timespent">
                                    {this.timeToString(timeSpentAmount)}
                                  </p>
                                  <p className="panel-section-info-wordCount">
                                    {`${sectionWordCount} words`}
                                  </p>
                                </div>
                              </div>
                            );
                          },
                        );
                      }
                      return (
                        <div className="panel-paragraph" key={index}>
                          <div className="panel-section-text">
                            <Typography
                              component="p"
                              className="panel-typography-title"
                            >
                              {key.slice(0, key.length - 2)}
                            </Typography>
                            <Typography
                              component="p"
                              className="panel-typography-detail"
                            >
                              <span
                                className="RichEditor-root"
                                dangerouslySetInnerHTML={{
                                  __html: this.handleHighlightKeywords(
                                    section_text_event[key],
                                  ),
                                }}
                              />
                            </Typography>
                          </div>

                          <div className="panel-section-info">
                            <p className="panel-section-info-timespent">
                              {this.timeToString(timeSpentAmount)}
                            </p>
                            <p className="panel-section-info-wordCount">
                              {`${sectionWordCount} words`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
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
                  {this.context.t('performance')}
                  {skillCategories.length <= 0 && (
                    <div className="lock-icon" component="p">
                      <Tooltip
                        title={this.context.t('sliderpane-lock-tooltip')}
                        placement="top"
                      >
                        <i className="fas fa-lock" />
                      </Tooltip>
                    </div>
                  )}
                </Typography>
                <Typography className="sub-title" component="p" />
              </ExpansionPanelSummary>
              {skillCategories.length > 0 && (
                <ExpansionPanelDetails className="panel-details-wrapper">
                  <Grid container>
                    <Grid xs={12}>
                      <PolarSpiderChart
                        series={chartData}
                        categories={skillCategories}
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              )}
            </ExpansionPanel>

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
                  {this.context.t('Talent')}
                  {skillCategories.length <= 0 && (
                    <div className="lock-icon" component="p">
                      <Tooltip
                        title={this.context.t('sliderpane-lock-tooltip')}
                        placement="top"
                      >
                        <i className="fas fa-lock" />
                      </Tooltip>
                    </div>
                  )}
                </Typography>
                <Typography className="sub-title" component="p" />
              </ExpansionPanelSummary>
              {skillCategories.length > 0 && (
                <ExpansionPanelDetails className="panel-typography">
                  <Typography
                    component="p"
                    className="panel-typography-talent-title"
                  >
                    Your talents ordered by your strengths
                  </Typography>
                  <Stepper
                    activeStep={this.state.activeStep}
                    orientation="vertical"
                  >
                    {talents.map(talent => (
                      <Step key={talent.label}>
                        <StepLabel>{talent.label}</StepLabel>
                        <StepContent>
                          <Typography>{talent.description}</Typography>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                  <div className="stepper-button">
                    <div>
                      <Button
                        disabled={this.state.activeStep === 0}
                        onClick={this.handleBack}
                        className="stepper-back-button"
                      >
                        Back
                      </Button>
                      <Button
                        disabled={
                          this.state.activeStep === skillData.length - 1
                        }
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </ExpansionPanelDetails>
              )}
            </ExpansionPanel>
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
                <Typography
                  className="title"
                  component="p"
                  style={{ display: 'flex' }}
                >
                  {this.context.t('Role Recommendations')}
                  <span className="lock-icon" style={{ paddingRight: '20px' }}>
                    <Tooltip
                      title={this.context.t('sliderpane-lock-tooltip')}
                      placement="top"
                    >
                      <i className="fas fa-lock" />
                    </Tooltip>
                  </span>
                </Typography>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          </div>
        </div>
      </SlidingPane>
    );
  }
}

SliderPane.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isDummyData: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

SliderPane.defaultProps = {
  tableData: {},
  isDummyData: false,
};

SliderPane.contextTypes = {
  t: PropTypes.func,
};

export default SliderPane;
