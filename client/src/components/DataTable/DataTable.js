import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell as _TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  Checkbox,
  Tooltip,
  TextField,
  InputAdornment,
  withStyles,
  Grid,
  Button,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Rename from '../../images/rename.svg';
import { connect } from 'react-redux';
import { compose } from 'redux';
import candidateActions from '../../redux/candidate/actions';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import './DataTable.scss';
import getDummyProfiles from './dummyData';
import ConfirmModal from '../Modals/ConfirmModal';
// import { cloneableGenerator } from 'redux-saga/utils';

const { updateCandidate } = candidateActions;
const TableCell = withStyles(theme => ({
  root: {
    padding: '5px 10px 5px 10px',
    '&:last-child': {
      paddingRight: '0px',
    },
  },
}))(_TableCell);

function desc(a, b, orderBy) {
  if (isNaN(a[orderBy])) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  } else {
    if (Number(b[orderBy]) < Number(a[orderBy])) {
      return -1;
    }
    if (Number(b[orderBy]) > Number(a[orderBy])) {
      return 1;
    }
  }

  return 0;
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {
    id: 'fullname',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    visible: true,
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
    visible: true,
  },
  {
    id: 'rank',
    numeric: true,
    disablePadding: false,
    label: 'Rank',
    visible: true,
  },
  {
    id: 'icons',
    numeric: false,
    disablePadding: false,
    label: '',
    visible: true,
  },
];

const talentRows = [
  {
    id: 'fullname',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    visible: true,
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
    visible: true,
  },
  // {
  //   id: 'icons',
  //   numeric: false,
  //   disablePadding: false,
  //   label: '',
  //   visible: true,
  // },
];

const filterRows = [
  {
    id: 'fullname',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    visible: true,
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
    visible: true,
  },

  {
    id: 'eduLevel',
    numeric: false,
    disablePadding: false,
    label: 'Education Level',
    visible: false,
  },
  {
    id: 'expYears',
    numeric: false,
    disablePadding: false,
    label: 'Experience Work',
    visible: false,
  },
  {
    id: 'roleFunction',
    numeric: false,
    disablePadding: false,
    label: 'Current Role',
    visible: false,
  },
  {
    id: 'roleLevel',
    numeric: false,
    disablePadding: false,
    label: 'Role Level',
    visible: false,
  },

  {
    id: 'roles',
    numeric: false,
    disablePadding: false,
    label: 'Roles interests',
    visible: false,
  },

  {
    id: 'skills',
    numeric: false,
    disablePadding: false,
    label: 'Skills',
    visible: false,
  },

  {
    id: 'createdDate',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    visible: false,
  },

  {
    id: 'isAuthorized',
    numeric: false,
    disablePadding: false,
    label: 'Cannadian Work',
    visible: false,
  },

  {
    id: 'icons',
    numeric: false,
    disablePadding: false,
    label: '',
    visible: true,
  },
];

const rowsNonFullScreen = [
  {
    id: 'fullname',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    visible: true,
  },
  {
    id: 'rank',
    numeric: true,
    disablePadding: false,
    label: 'Rank',
    visible: true,
  },
  {
    id: 'icons',
    numeric: false,
    disablePadding: false,
    label: '',
    visible: true,
  },
];

const candidates_rows = [
  {
    id: 'fullname',
    numeric: false,
    disablePadding: false,
    label: 'Name',
    visible: true,
  },
  {
    id: 'rank',
    numeric: true,
    disablePadding: false,
    label: 'Rank',
    visible: true,
  },
  {
    id: 'icons',
    numeric: false,
    disablePadding: false,
    label: '',
    visible: true,
  },
];
const paperStyle = {
  padding: 0,
  width: 120,
  height: 100,
  borderRadius: 6,
  border: 'solid 1px rgba(223, 225, 230, 0.7)',
  boxShadow: '0 25px 50px 0 rgba(33, 81, 162, 0.11)',
};
let addNewCell = [];
let isfocus = [];
let emailId = [];
let hover = [];
let field_name = [];
let isfocuson = [];

class EnhancedTableHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addfieldpressed: false,
      table_row: [],
      newfieldFilled: [],
      field_name: [],
      initialopen: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      open: [false, false, false, false, false, false, false, false, false],
    };
  }
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  getTableRows = (type, isFullScreenPipeline) => {
    if (type === 3) {
      return talentRows;
    }

    if (type === 1) {
      if (isFullScreenPipeline) {
        return rows;
      }
      return rowsNonFullScreen;
    }
    return candidates_rows;
  };

  componentDidMount() {
    const { type, isFullScreenPipeline, filterCells } = this.props;
    let table_row;
    let i;
    if (!filterCells) {
      table_row = this.getTableRows(type, isFullScreenPipeline);
      this.setState({ table_row });
    } else {
      table_row = filterRows;
      for (i = 0; i < 8; i++) filterRows[i + 2].visible = filterCells[i].isShow;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.table_row !== prevState.table_row) {
      this.props.table_row(this.state.table_row);
    }
  }

  handleaddField = () => {
    this.setState({ addfieldpressed: true });
  };

  handleclearField = () => {
    this.setState({ addfieldpressed: false });
  };

  handleChange = (index, e) => {
    field_name[index] = e.target.value;
    this.setState({ field_name: field_name });
  };

  stringClick = () => {
    let add_row = {
      id: 'add',
      numeric: false,
      disablePadding: false,
      label: 'New Field',
      visible: true,
      type: 'string',
    };
    this.setState({ table_row: [...this.state.table_row, add_row] });
    this.setState({ addfieldpressed: false });
    this.props.addBT_clicked('string');
  };

  specClick = () => {
    let add_row = {
      id: 'add',
      numeric: false,
      disablePadding: false,
      label: 'New Field',
      visible: true,
      type: 'spec',
    };
    this.setState({ table_row: [...this.state.table_row, add_row] });
    this.setState({ addfieldpressed: false });
    this.props.addBT_clicked('spec');
  };

  currencyClick = () => {
    let add_row = {
      id: 'add',
      numeric: false,
      disablePadding: false,
      label: 'New Field',
      visible: true,
      type: 'currency',
    };
    this.setState({ table_row: [...this.state.table_row, add_row] });
    this.setState({ addfieldpressed: false });
    this.props.addBT_clicked('currency');
  };

  percentClick = () => {
    let add_row = {
      id: 'add',
      numeric: false,
      disablePadding: false,
      label: 'New Field',
      visible: true,
      type: 'percent',
    };
    this.setState({ table_row: [...this.state.table_row, add_row] });
    this.setState({ addfieldpressed: false });
    this.props.addBT_clicked('percent');
  };
  focusout = index => {
    let currentFilled = [...this.state.newfieldFilled];
    currentFilled[index] = true;
    this.setState({ newfieldFilled: currentFilled });
    this.props.updatefieldname(this.state.field_name);
  };
  handleToggle = index => {
    let currentopen = [...this.state.open];
    currentopen[index] = !this.state.open[index];
    this.setState({ open: currentopen });
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: this.state.initialopen });
  };

  onRename = index => {
    let currentFilled = [...this.state.newfieldFilled];
    currentFilled[index] = false;
    this.setState({ newfieldFilled: currentFilled });
  };

  handleRemove = (index, event) => {
    let currenttableRow = [...this.state.table_row];
    let currentnewfiledFilled = [...this.state.newfieldFilled];
    let currentfield_name = [...this.state.field_name];
    currenttableRow.splice(index, 1);
    currentnewfiledFilled.splice(index, 1);
    currentfield_name.splice(index, 1);
    this.setState(
      {
        table_row: currenttableRow,
        newfieldFilled: currentnewfiledFilled,
        field_name: currentfield_name,
      },
      () => {
        this.props.handleRemoveCell(index);
      },
    );
  };

  render() {
    const {
      order,
      orderBy,
      type,
      isFullScreenPipeline,
      showCheckbox,
      filterCells,
    } = this.props;
    const { newfieldFilled, field_name } = this.state;
    const { addfieldpressed, table_row, open } = this.state;
    return (
      <TableHead className="table_header">
        <TableRow>
          {showCheckbox && (
            <TableCell padding="checkbox">
              {/* <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              /> */}
            </TableCell>
          )}
          {table_row &&
            table_row.map((row, index) => {
              if (row.id === 'rank' && this.props.benchmark) {
                return '';
              } else if (row.id === 'add') {
                return (
                  <TableCell
                    key={row.id}
                    numeric={row.numeric}
                    padding={row.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === row.id ? order : false}
                  >
                    {!newfieldFilled[index] ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Field Name"
                        value={field_name[index]}
                        onChange={e => this.handleChange(index, e)}
                        onBlur={() => this.focusout(index)}
                      />
                    ) : (
                      <div>
                        <Typography className="menu" component="div">
                          <div>
                            <TableSortLabel
                              buttonRef={node => {
                                this.anchorEl = node;
                              }}
                              active={orderBy === row.id}
                              direction={order}
                              // onClick={this.createSortHandler(row.id)}
                              onClick={() => this.handleToggle(index)}
                              className="newheaderLabel"
                            >
                              {field_name[index]}
                            </TableSortLabel>
                            <Menu
                              id={'card-options' + index}
                              anchorEl={this.anchorEl}
                              open={open[index]}
                              onClose={this.handleClose}
                              className="card-options1"
                              MenuListProps={{
                                disablePadding: true,
                              }}
                              PaperProps={{
                                style: paperStyle,
                              }}
                              disableAutoFocusItem
                            >
                              <MenuItem
                                className="option-item1"
                                onClick={event => {
                                  this.handleClose(event);
                                  this.onRename(index, event);
                                }}
                              >
                                <ListItemIcon className="text-icon1">
                                  <img
                                    src={Rename}
                                    alt=""
                                    className="copy-icon"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  inset
                                  primary="Rename"
                                  className="menu-title1"
                                />
                              </MenuItem>

                              <MenuItem
                                className="option-item1"
                                onClick={event => {
                                  this.handleClose(event);
                                  this.handleRemove(index, event);
                                }}
                              >
                                <ListItemIcon className="text-icon1">
                                  <Delete />
                                </ListItemIcon>
                                <ListItemText
                                  inset
                                  primary="Delete"
                                  className="menu-title1"
                                />
                              </MenuItem>
                            </Menu>
                          </div>
                        </Typography>
                        {/* <Tooltip
                      title="Sort"
                      placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        // onClick={this.createSortHandler(row.id)}
                        onClick={this.edit_field}
                        className="headerLabel"
                      > 
                      {field_name[index]}
                      </TableSortLabel>
                    </Tooltip> */}
                      </div>
                    )}
                  </TableCell>
                );
              } else if (row.visible === true)
                return (
                  <TableCell
                    key={row.id}
                    numeric={row.numeric}
                    padding={row.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === row.id ? order : false}
                  >
                    <Tooltip
                      title="Sort"
                      placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                        className="headerLabel"
                      >
                        {row.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                );
            }, this)}
          <Fragment>
            {addfieldpressed ? (
              <div className="root_container">
                <div className="clear-container">
                  <div className="item-tool-top" onClick={this.stringClick}>
                    A
                  </div>
                  <div className="item-tool-bottom" onClick={this.specClick}>
                    #
                  </div>
                  <div className="item-tool-right" onClick={this.currencyClick}>
                    $
                  </div>
                  <div className="item-tool-left" onClick={this.percentClick}>
                    %
                  </div>
                  <div className="item-tool-clear" onClick={this.clearClick}>
                    <IconButton
                      onClick={this.handleclearField}
                      aria-label="filter list"
                      style={{ color: '#826af9', padding: 0 }}
                      size="small"
                      disableRipple={true}
                    >
                      <Clear />
                    </IconButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="addbutton">
                <Tooltip title="Add new field" placement="top-start">
                  <IconButton
                    onClick={this.handleaddField}
                    aria-label="filter list"
                    style={{ color: '#826af9' }}
                    size="small"
                    disableRipple={true}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </Fragment>
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

let EnhancedTableToolbar = props => {
  const {
    // numSelected,
    // profileData,
    // handleSettings,
    // showCheckbox,
    showSearchBar,
  } = props;
  // const highlighted = numSelected > 0 ? 'highlight_true' : 'highlight_false';

  return (
    <Toolbar className={`toolbarRoot `}>
      <div className="toolbar_title toolbar_spacer">
        {showSearchBar && (
          <TextField
            fullWidth
            label="Search Name"
            InputProps={{
              startAdornment: <InputAdornment position="start" />,
            }}
            className="search_input"
            variant="outlined"
            onChange={event => props.searchHandler(event)}
          />
        )}
        {/* {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            className="member_toolbar"
            variant="title"
            id="tableTitle"
          >
            <PeopleIcon />
            <span className="member_count">{profileData.length}</span>
          </Typography>
        )} */}
      </div>
      {/* <div className={'toolbar_actions'}>
        <Tooltip title="Setting">
          <IconButton aria-label="Setting" disabled={numSelected === 0}>
            <SettingsApplications onClick={handleSettings} />
          </IconButton>
        </Tooltip>
      </div> */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  showSearchBar: PropTypes.bool,
};

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    const { data: profileData = getDummyProfiles(60, 1) } = props;

    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: props.selectedUsers,
      data: profileData,
      originData: profileData,
      page: 0,
      rowsPerPage: 10,
      currentUserId: 0,
      deletedUser: [-1],
      showDeleteConfirmModal: 0,
      isfocus: [],
      isfocuson: [],
      hover: [],
      addNewCell: [],
      emailId: [],
      newfield_name: '',
      isaddBT_clicked: false,
      field_type: '',
      table_row: [],
    };
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      originData: props.data,
    });
  }

  componentDidMount() {
    this.setState({ emailId });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data && prevProps.data.length !== this.props.data.length) {
      this.setState({ data: this.props.data });
    }
    // if (this.state.data !== prevState.data){
    const { index, pipeline } = this.props;
    const { newfield_name, addNewCell, emailId } = this.state;
    this.props.updateCandidate({
      challengeId: pipeline.challenge_id,
      pipelineId: pipeline._id,
      userId: emailId,
      data: {
        newfield_name: newfield_name,
        addNewCell: addNewCell,
      },
    });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (id, selection, ind, showSlide) => {
    const { selected, data } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    const currentUser = data.find(item => item.id === id);
    if (!showSlide) currentUser.isChecked = false; //onCheckRow

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      if (!showSlide) currentUser.isChecked = true; //onCheckRow
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });

    if (this.props.onSelectUser) {
      this.props.onSelectUser(currentUser);
    }
    if (selection && showSlide) {
      const firstName = data[ind].firstname;
      const lastName =
        !data[ind].lastname || data[ind].lastname === 'null'
          ? ''
          : data[ind].lastname;

      this.props.onShowSlidePane(
        data[ind].fullname || `${firstName} ${lastName}`,
        data[ind].rank,
        data[ind].email,
        data[ind].uuid,
        data[ind],
      );
    }
  };

  handleCheckRow = (event, checked, id, ind) => {
    this.handleClick(id, checked, ind);
    event.stopPropagation();
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleSettings = () => {
    const { selected } = this.state;
    const { handleSettings } = this.props;

    handleSettings(selected);
  };

  isSelected = id => {
    return this.props.selectedUsers.find(user => user.id === id) !== undefined;
  };
  hoverOn = (i, index) => {
    if (hover == undefined || hover == null) {
      hover = [];
    }
    if (hover[i] == undefined || hover[i] == null) {
      hover[i] = [];
    }
    hover[i][index] = true;
    this.setState({ hover });
  };

  hoverOff = (i, index) => {
    if (hover == undefined || hover == null) {
      hover = [];
    }
    if (hover[i] == undefined || hover[i] == null) {
      hover[i] = [];
    }
    hover[i][index] = false;
    this.setState({ hover });
  };
  renderTableCells = (type, isFullScreen, n, filterCells, index) => {
    const { benchmark } = this.props;
    const {
      addNewCell,
      isfocus,
      isaddBT_clicked,
      hover,
      field_type,
      table_row,
      isfocuson,
    } = this.state;
    const { fullname = '', firstname = '', lastname = '', email, id } = n;
    const cid = email;
    emailId[index] = cid;
    const isCandidate = type !== 1 && type !== 3;

    const fullName = fullname;
    const firstName = firstname;
    const lastName = !lastname || lastname === 'null' ? '' : lastname;

    console.log('addnewcell===>', this.state.addNewCell);
    console.log('isfocus===>', this.state.isfocus);
    console.log('hover===>', this.state.hover);

    if (isCandidate) {
      // TODO: implement for tablecells for  canditate here
      return (
        <Fragment>
          <TableCell>{fullName || `${firstName} ${lastName}`}</TableCell>
          {!benchmark ? (
            <TableCell numeric={true}>{Number(n.rank)}</TableCell>
          ) : (
            ''
          )}
          <TableCell>
            <Grid container justify="space-between">
              <Grid items xs={2}>
                <Tooltip title="Star" placement="top-start">
                  <i
                    className={`fas fa-star icons  ${
                      n.state !== 3 ? 'hidden' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      this.setCommendation(cid, 3);
                    }}
                  />
                </Tooltip>
              </Grid>

              <Grid items xs={2}>
                <Tooltip title="Like" placement="top-start">
                  <i
                    className={`far fa-thumbs-up thumbup icons far ${
                      n.state !== 1 ? 'hidden' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      this.setCommendation(cid, 1);
                    }}
                  />
                </Tooltip>
              </Grid>
              <Grid items xs={2}>
                <Tooltip title="Dislike" placement="top-start">
                  <i
                    className={`fa-thumbs-down thumbdown icons far ${
                      n.state !== 2 ? 'hidden' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      this.setCommendation(cid, 2);
                    }}
                  />
                </Tooltip>
              </Grid>
              <Grid items xs={2}>
                <Tooltip title="Actions" placement="top-start">
                  <i
                    className={`fa fa-ellipsis-h ellipsis icons far ${
                      n.state !== 4 ? 'hidden' : ''
                    }`}
                  />
                </Tooltip>
              </Grid>
              <Grid items xs={2} className="deleteIcon">
                <Tooltip title="Delete" placement="top-start">
                  <i
                    className={`fa fa-trash icons far ${
                      n.state !== 5 ? 'hidden' : ''
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      this.handleRemoveUser(cid);
                    }}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </TableCell>
        </Fragment>
      );
    }
    if (type === 1 || type === 3) {
      if (isFullScreen) {
        return (
          <Fragment className="row">
            <TableCell>{fullName || `${firstName} ${lastName}`}</TableCell>

            <TableCell>{n.email}</TableCell>
            {filterCells &&
              filterCells.map(filterCell => {
                if (filterCell.isShow == true) {
                  const value = filterCell.value;
                  if (value == 'isAuthorized')
                    return n['authorization_status'] ? (
                      <TableCell>Yes</TableCell>
                    ) : (
                      <TableCell>No</TableCell>
                    );
                  else {
                    return (
                      <TableCell>
                        {Array.isArray(n[value]) ? (
                          n[value].map(item => (
                            <Button
                              variant="contained"
                              color="primary"
                              style={{
                                maxHeight: '25px',
                                fontSize: '75%',
                                marginRight: '2px',
                              }}
                            >
                              {item}
                            </Button>
                          ))
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            style={{
                              maxHeight: '25px',
                              fontSize: '75%',
                              marginRight: '2px',
                            }}
                          >
                            {n[value]}
                          </Button>
                        )}
                      </TableCell>
                    );
                  }
                }
              })}
            {table_row.slice(2).map((each_field, i) => {
              if (hover == undefined || hover == null) {
                hover = [];
              }
              if (hover[i] == undefined || hover[i] == null) {
                hover[i] = [];
              }
              if (isfocus == undefined || isfocus == null) {
                isfocus = [];
              }
              if (isfocus[i] == undefined || isfocus[i] == null) {
                isfocus[i] = [];
              }
              if (isfocuson == undefined || isfocuson == null) {
                isfocuson = [];
              }
              if (isfocuson[i] == undefined || isfocuson[i] == null) {
                isfocuson[i] = [];
              }
              if (addNewCell == undefined || addNewCell == null) {
                addNewCell = [];
              }
              if (addNewCell[i] == undefined || addNewCell[i] == null) {
                addNewCell[i] = [];
              }

              // console.log("confirm===>",this.state.isfocuson[0][2])
              if (isaddBT_clicked) {
                return (
                  <TableCell
                    onMouseLeave={() => this.hoverOff(i, index)}
                    onMouseEnter={() => this.hoverOn(i, index)}
                    className="table-cell"
                  >
                    {!isfocus[i][index] ? (
                      <>
                        {hover[i][index] ? (
                          <>
                            {(() => {
                              switch (field_type) {
                                case 'string':
                                  return (
                                    <input
                                      className="addform-control"
                                      type="text"
                                      value={addNewCell[i][index]}
                                      onBlur={() => this.focusout(i, index)}
                                      onFocus={() => this.focuson(i, index)}
                                      onChange={e =>
                                        this.onChangeText(i, index, 'string', e)
                                      }
                                    />
                                  );
                                case 'spec':
                                  return (
                                    <input
                                      className="addform-control"
                                      type="text"
                                      value={addNewCell[i][index]}
                                      onBlur={() => this.focusout(i, index)}
                                      onFocus={() => this.focuson(i, index)}
                                      onChange={e =>
                                        this.onChangeText(i, index, 'spec', e)
                                      }
                                    />
                                  );
                                case 'currency':
                                  return (
                                    <input
                                      className="addform-control"
                                      type="text"
                                      value={addNewCell[i][index]}
                                      onBlur={() => this.focusout(i, index)}
                                      onFocus={() => this.focuson(i, index)}
                                      onChange={e =>
                                        this.onChangeText(
                                          i,
                                          index,
                                          'currency',
                                          e,
                                        )
                                      }
                                    />
                                  );
                                case 'percent':
                                  return (
                                    <input
                                      className="addform-control"
                                      type="text"
                                      value={addNewCell[i][index]}
                                      onBlur={() => this.focusout(i, index)}
                                      onFocus={() => this.focuson(i, index)}
                                      onChange={e =>
                                        this.onChangeText(
                                          i,
                                          index,
                                          'percent',
                                          e,
                                        )
                                      }
                                    />
                                  );
                              }
                            })()}
                          </>
                        ) : (
                          <>
                            {isfocuson[i][index] && (
                              <>
                                {(() => {
                                  switch (field_type) {
                                    case 'string':
                                      return (
                                        <input
                                          className="addform-control"
                                          type="text"
                                          value={addNewCell[i][index]}
                                          onBlur={() => this.focusout(i, index)}
                                          onFocus={() => this.focuson(i, index)}
                                          onChange={e =>
                                            this.onChangeText(
                                              i,
                                              index,
                                              'string',
                                              e,
                                            )
                                          }
                                        />
                                      );
                                    case 'spec':
                                      return (
                                        <input
                                          className="addform-control"
                                          type="text"
                                          value={addNewCell[i][index]}
                                          onBlur={() => this.focusout(i, index)}
                                          onFocus={() => this.focuson(i, index)}
                                          onChange={e =>
                                            this.onChangeText(
                                              i,
                                              index,
                                              'spec',
                                              e,
                                            )
                                          }
                                        />
                                      );
                                    case 'currency':
                                      return (
                                        <input
                                          className="addform-control"
                                          type="text"
                                          value={addNewCell[i][index]}
                                          onBlur={() => this.focusout(i, index)}
                                          onFocus={() => this.focuson(i, index)}
                                          onChange={e =>
                                            this.onChangeText(
                                              i,
                                              index,
                                              'currency',
                                              e,
                                            )
                                          }
                                        />
                                      );
                                    case 'percent':
                                      return (
                                        <input
                                          className="addform-control"
                                          type="text"
                                          value={addNewCell[i][index]}
                                          onBlur={() => this.focusout(i, index)}
                                          onFocus={() => this.focuson(i, index)}
                                          onChange={e =>
                                            this.onChangeText(
                                              i,
                                              index,
                                              'percent',
                                              e,
                                            )
                                          }
                                        />
                                      );
                                  }
                                })()}
                              </>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {addNewCell[i][index] && (
                          <>
                            {(() => {
                              switch (field_type) {
                                case 'string':
                                  return `${addNewCell[i][index]}`;
                                case 'spec':
                                  return `${addNewCell[i][index]}`;
                                case 'currency':
                                  return `$${addNewCell[i][index]}`;
                                case 'percent':
                                  return `${addNewCell[i][index]}%`;
                              }
                            })()}
                          </>
                        )}
                      </>
                    )}
                  </TableCell>
                );
              }
            })}
            <TableCell>
              <Grid container justify="space-between">
                <Grid items xs={2}>
                  <Tooltip title="Star" placement="top-start">
                    <i
                      className={`fas fa-star icons  ${
                        n.state !== 3 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.setCommendation(cid, 3);
                      }}
                    />
                  </Tooltip>
                </Grid>

                <Grid items xs={2}>
                  <Tooltip title="Like" placement="top-start">
                    <i
                      className={`far fa-thumbs-up thumbup icons far ${
                        n.state !== 1 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.setCommendation(cid, 1);
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2}>
                  <Tooltip title="Dislike" placement="top-start">
                    <i
                      className={`fa-thumbs-down thumbdown icons far ${
                        n.state !== 2 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.setCommendation(cid, 2);
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2}>
                  <Tooltip title="Actions" placement="top-start">
                    <i
                      className={`fa fa-ellipsis-h ellipsis icons far ${
                        n.state !== 4 ? 'hidden' : ''
                      }`}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2} className="deleteIcon">
                  <Tooltip title="Delete" placement="top-start">
                    <i
                      className={`fa fa-trash ellipsis icons far ${
                        n.state !== 5 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.handleRemoveUser(cid);
                      }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </TableCell>
          </Fragment>
        );
      }
      if (!isFullScreen) {
        return (
          <Fragment>
            <TableCell>{fullName || `${firstName} ${lastName}`}</TableCell>
            <TableCell>{n.email}</TableCell>

            <TableCell>
              <Grid container justify="space-between">
                <Grid items xs={2}>
                  <Tooltip title="Star" placement="top-start">
                    <i
                      className={`fas fa-star icons  ${
                        n.state !== 3 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.setCommendation(cid, 3);
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2}>
                  <Tooltip title="Like" placement="top-start">
                    <i
                      className={`far fa-thumbs-up thumbup icons far ${
                        n.state !== 1 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.setCommendation(cid, 1);
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2}>
                  <Tooltip title="Dislike" placement="top-start">
                    <i
                      className={`fa-thumbs-down thumbdown icons far ${
                        n.state !== 2 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.setCommendation(cid, 2);
                      }}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2}>
                  <Tooltip title="Actions" placement="top-start">
                    <i
                      className={`fa fa-ellipsis-h ellipsis icons far ${
                        n.state !== 4 ? 'hidden' : ''
                      }`}
                    />
                  </Tooltip>
                </Grid>
                <Grid items xs={2} className="deleteIcon">
                  <Tooltip title="Delete" placement="top-start">
                    <i
                      className={`fa fa-trash ellipsis icons far ${
                        n.state !== 5 ? 'hidden' : ''
                      }`}
                      onClick={e => {
                        e.stopPropagation();
                        this.handleRemoveUser(cid);
                      }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </TableCell>
          </Fragment>
        );
      }
    }
  };
  searchHandler(event) {
    const { originData } = this.state;
    const filteredData = originData.filter(item => {
      if (!item || !item.fullname) {
        return false;
      }
      return item.fullname
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    this.setState({ data: filteredData });
  }
  getGroup = rank => {
    if (rank <= 25) {
      return 'rank_25';
    }
    if (rank <= 75) {
      return 'rank_75';
    }
    if (rank <= 100) {
      return 'rank_100';
    }
    if (!rank) {
      return 'rank_no';
    }
  };

  setCommendation = (cid, type) => {
    const { userAction } = this.props;
    const { data } = this.state;
    const index = data.findIndex(item => {
      return item.email === cid;
    });
    if (index >= 0) {
      data[index].state = type;
      this.setState({ data });
    }
    if (userAction) {
      userAction(cid, type);
    }
  };

  removeUser = cid => {
    const { currentUserId } = this.state;
    this.setState({ showDeleteConfirmModal: false });
    this.setState({
      deletedUser: this.state.deletedUser.concat(currentUserId),
    });

    const { userAction } = this.props;
    const { data } = this.state;
    // if (index >= 0) {
    //   data[index].state = type;
    //   this.setState({ data });
    // }
    const removeType = 4;
    if (userAction) {
      userAction(this.state.currentUserId, removeType);
    }
  };

  handleRemoveUser = cid => {
    const { userAction } = this.props;
    const { data } = this.state;
    const index = data.findIndex(item => {
      return item.email === cid;
    });
    this.setState({
      currentUserId: index,
      showDeleteConfirmModal: true,
    });
  };

  onChangeText = (i, index, field_type, e) => {
    if (addNewCell == undefined || addNewCell == null) {
      addNewCell = [];
    }
    if (addNewCell[i] == undefined || addNewCell[i] == null) {
      addNewCell[i] = [];
    }
    if (field_type == 'string') {
      const re = /[^A-Za-z]/;
      if (e.target.value === '' || !re.test(e.target.value)) {
        addNewCell[i][index] = e.target.value;
        this.setState({ addNewCell: addNewCell });
      }
    } else if (field_type == 'spec') {
      const re1 = /^[0-9\b]+$/;
      if (e.target.value === '' || re1.test(e.target.value)) {
        addNewCell[i][index] = e.target.value;
        this.setState({ addNewCell: addNewCell });
      }
    } else {
      addNewCell[i][index] = e.target.value;
      this.setState({ addNewCell: addNewCell });
    }
  };

  focusout = (i, index) => {
    if (isfocus == undefined || isfocus == null) {
      isfocus = [];
    }
    if (isfocus[i] == undefined || isfocus[i] == null) {
      isfocus[i] = [];
    }
    isfocus[i][index] = true;
    this.setState({ isfocus: isfocus });
  };
  focuson = (i, index) => {
    if (isfocuson == undefined || isfocuson == null) {
      isfocuson = [];
    }
    if (isfocuson[i] == undefined || isfocuson[i] == null) {
      isfocuson[i] = [];
    }
    isfocuson[i][index] = true;
    console.log('value===>', i, index, this.state.isfocuson);
    this.setState({ isfocuson: isfocuson });
  };
  addBT_clicked = field_type => {
    this.setState({ isaddBT_clicked: true, field_type: field_type });
  };

  updatefieldname = field_name => {
    this.setState({ newfield_name: field_name });
  };

  getAllTable = table_row => {
    this.setState({ table_row });
  };
  handleRemoveCell = index => {
    console.log('indexxx====', index);
    let newaddNewCell = [];
    let newisfocus = [];
    let newisfocuson = [];
    let newhover = [];
    let currentaddNewCell = [...this.state.addNewCell];
    let currentisfocus = [...this.state.isfocus];
    let currentisfocuson = [...this.state.isfocuson];
    let currenthover = [...this.state.hover];
    this.state.table_row.map((table, i) => {
      newaddNewCell = currentaddNewCell[index - 2].splice(i, 1);
      newisfocus = currentisfocus[index - 2].splice(i, 1);
      newisfocuson = currentisfocuson[index - 2].splice(i, 1);
      newhover = currenthover[index - 2].splice(i, 1);
    });
    this.setState({
      addNewCell: newaddNewCell,
      isfocus: newisfocus,
      isfocuson: newisfocuson,
      hover: newhover,
    });
  };

  render() {
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      field_type,
    } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const {
      type,
      expanded,
      isFullScreenPipeline,
      showCheckbox,
      showSearchBar,
      className,
      filterCells,
    } = this.props;
    return (
      <Paper className={`${className} tableRoot`}>
        {showSearchBar && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            profileData={this.state.data}
            handleSettings={this.handleSettings}
            showCheckbox={showCheckbox}
            showSearchBar={showSearchBar}
            searchHandler={this.searchHandler.bind(this)}
          />
        )}
        {expanded && (
          <Fragment>
            <div className={'tableWrapper'}>
              <Table className={'tableMain'} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                  type={type}
                  key={type}
                  isFullScreenPipeline={isFullScreenPipeline}
                  showCheckbox={showCheckbox}
                  benchmark={this.props.benchmark}
                  filterCells={this.props.filterCells}
                  addBT_clicked={this.addBT_clicked}
                  updatefieldname={this.updatefieldname}
                  table_row={this.getAllTable}
                  handleRemoveCell={this.handleRemoveCell}
                />
                <TableBody>
                  {data
                    .sort(getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n, index) => {
                      const id = n.id || index;
                      const isSelected = this.isSelected(id);
                      return (
                        <TableRow
                          hover
                          onClick={event =>
                            this.handleClick(id, true, index, true)
                          }
                          className={`${this.getGroup(n.rank)} user-row `}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={index}
                          selected={isSelected}
                        >
                          {showCheckbox && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                onClick={e => {
                                  e.stopPropagation();
                                }}
                                onChange={(event, checked) => {
                                  this.handleCheckRow(
                                    event,
                                    checked,
                                    id,
                                    index,
                                  );
                                }}
                              />
                            </TableCell>
                          )}
                          {this.renderTableCells(
                            type,
                            isFullScreenPipeline,
                            n,
                            filterCells,
                            index,
                          )}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Fragment>
        )}

        <ConfirmModal
          data={this.state.currentBubble}
          onConfirm={this.removeUser}
          content={this.context.t('are-you-sure-you-want-to-delete-this')}
          confirmText={this.context.t('delete')}
          isOpened={this.state.showDeleteConfirmModal}
          onCancel={() => {
            this.setState({ showDeleteConfirmModal: false });
          }}
        />
      </Paper>
    );
  }
}

EnhancedTable.contextTypes = {
  t: PropTypes.func,
};
EnhancedTable.propTypes = {
  selectedUsers: PropTypes.array,
  type: PropTypes.number,
  expanded: PropTypes.bool,
  isFullScreenPipeline: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  showSearchBar: PropTypes.bool,
  className: PropTypes.string,
  highlightRow: PropTypes.bool,
  benchmark: PropTypes.bool,
  onShowSlidePane: PropTypes.func,
  handleSettings: PropTypes.func,
};

EnhancedTable.defaultProps = {
  selectedUsers: [],
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  curChallenge: state.challengeReducer.curChallenge,
  isLoading: state.challengeReducer.isLoading,
  candidate: state.candidateReducer.candidate,
  pipelineResult: state.adminReducer.pipelines,
  i18nState: state.i18nState,
});

const mapDispatchToProps = {
  updateCandidate,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(EnhancedTable);
