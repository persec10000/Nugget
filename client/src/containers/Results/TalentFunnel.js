import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { AreaChart } from '../Charts/Charts';
import DataTable from '../../components/DataTable';

class TalentFunnel extends Component {
  static propTypes = {
    prop: PropTypes,
  };
  constructor(props) {
    super(props);
    this.state = {
      pipelines: [],
      chartData: [],
      originCandidates: [],
      currentPipeline: '',
      userRange: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { pipelines } = props;
    const pipeline = pipelines[props.benchmark];
    const users = pipeline ? pipeline.users : [];

    this.setState({
      pipelines,
      originCandidates: users || [],
    });
  }

  handleChangeFunnelPipeline = pipeline => {
    this.setState({
      currentPipeline: pipeline._id,
      originCandidates: pipeline.users,
      users: pipeline.users,
    });
  };

  setUserRange = range => {
    const users = [];
    const { originCandidates, userRange } = this.state;
    if (userRange === range) {
      return;
    }
    let i;
    for (i = 0; i < originCandidates.length; i += 1) {
      if (parseInt(originCandidates[i].rank) <= parseInt(range)) {
        users.push(originCandidates[i]);
      }
    }
    this.setState({ userRange: range, users });
  };

  changeSelectedUser = user => {
    this.setState({ selectedUsers: [user] });
  };

  render() {
    const { chartData, selectedUsers } = this.state;
    const { pipelines, benchmark } = this.props;
    let allUsers = [];
    pipelines.forEach((pipeline, index) => {
      const { users } = pipeline;
      if (index !== benchmark) {
        return;
      }
      allUsers = [...users];
    });

    console.log('all users for datatable ', allUsers);

    return (
      <Grid container spacing={32}>
        <Grid item xs={12} md={6}>
          <AreaChart
            series={chartData}
            selectArea={range => this.setUserRange(range)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataTable
            key={benchmark}
            data={allUsers}
            expanded={true}
            type={2}
            isFullScreenPipeline={false}
            onShowSlidePane={this.props.showSlide}
            handleSettings={this.handleSettings}
            showCheckbox={false}
            showSearchBar={true}
            className="talent-datagrid"
            highlightRow={true}
            selectedUsers={selectedUsers}
            onSelectUser={user => this.changeSelectedUser(user)}
            userAction={(cid, type) => {
              this.props.onClickIcon(cid, type);
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

TalentFunnel.propTypes = {
  pipelines: PropTypes.object,
};

export default TalentFunnel;
