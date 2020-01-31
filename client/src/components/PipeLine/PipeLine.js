import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Grid,
  Switch,
  TextField,
  InputAdornment,
  Typography,
  Button,
  Popper,
  MenuItem,
  Paper,
  ClickAwayListener,
  MenuList,
  Grow,
  ListItemIcon,
  ListItemText,
  withStyles,
  Divider,
  Badge,
  Menu,
} from '@material-ui/core';
import {
  MoreHoriz,
  Delete,
  SaveAltOutlined,
  InfoOutlined,
  ExpandMore,
  ExpandLess,
  FilterList,
} from '@material-ui/icons';
import CopyIcon from '../../images/copy-icon.svg';
import DataTable from '../DataTable';
import './PipeLine.scss';
import FilterModal from '../Modals/FilterModal';

const theme = createMuiTheme({
  overrides: {
    MuiSwitch: {
      bar: {
        '$checked$checked + &': {
          opacity: 0.4,
          backgroundColor: '#52d869', // Light green, aka #74d77f
        },
      },
    },
  },
});

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#5bd632',
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  colorSecondary: {
    '&$checked': {
      '& + $bar': {
        opacity: 0.3,
        backgroundColor: 'white',
      },
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid #5bd632`,
    backgroundColor: '#5bd632',
    opacity: 1,
  },
  checked: {},
  focusVisible: {},
})(Switch);

export default class PipeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      benchmark: true,
      anchorEl: null,
      open: false,
      showSearchBar: false,
      showSearchButton: true,
      showFilterModal: false,
      filterValue: '',
      filterCellCount: 0,
    };
  }
  componentDidMount() {
    const { filterCells } = this.props;
    const filterCellCount =
      filterCells &&
      filterCells.filter(filterCell => filterCell.isShow == true).length;
    if (filterCellCount) this.setState({ filterCellCount });
  }
  handleClickTitle = event => {
    event.stopPropagation();
  };

  handleChangeSwitch = name => event => {
    this.props.changeBenchmark(this.props.pid);
  };

  handleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  onFileCopyClicked = () => {
    const { openSnackBar, copyLink } = this.props;
    openSnackBar(this.props.title);
    copyLink();
  };

  handleSettings = selected => {
    this.props.handleSettings(selected);
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

  handleArchive = event => {
    this.props.onRemove(event);
    this.handleClose(event);
  };

  handleRemove = event => {
    this.props.onRemove(event);
    this.handleClose(event);
  };

  handleUserAction = (cid, type) => {
    const { onClickIcon } = this.props;
    if (onClickIcon) {
      onClickIcon(cid, type);
    }
  };
  /**
   * When click button to show search bar
   */
  handleSearchBar = event => {
    this.setState({ showSearchBar: true, showSearchButton: false });
    if (this.state.showSearchButton == false) {
      this.setState({
        showSearchBar: false,
        showSearchButton: true,
        filterValue: '',
      });
      const { onChangeFilterValue } = this.props;
      onChangeFilterValue('');
    }
  };
  /**
   * Update filtervalue when user change value
   */
  handleUpdateSearch = event => {
    const { onChangeFilterValue } = this.props;
    this.setState({ filterValue: event.target.value });
    onChangeFilterValue(event.target.value.toLowerCase());
  };

  onShowFilterModal = () => {
    this.setState({ showFilterModal: true });
  };
  onSkipFilterModal = filterlist => {
    this.setState({ showFilterModal: false });
  };
  //close filter modal then show pipeline which has list by Filter
  onCloseFilterModal = filterlist => {
    this.setState({ showFilterModal: false });
    this.props.onShowPipelineByFilter(!this.state.showFilterModal, filterlist);
  };
  render() {
    const {
      benchmark,
      width,
      title,
      isFullScreenPipeline,
      handleUpdateTitle,
      color,
      showCheckbox,
      pipelineType,
      userData,
    } = this.props;
    const {
      expanded,
      open,
      showSearchBar,
      showSearchButton,
      filterValue,
      showFilterModal,
      filterCellCount,
    } = this.state;
    const SearchFieldActive = showSearchBar ? 'active' : 'none';

    return (
      <Grid className="PipeLine" item xs={width}>
        <Grid container>
          <Grid
            className="pipe_header"
            item
            xs={12}
            style={{ borderColor: color }}
          >
            <div className="expand_but" onClick={this.handleExpand}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </div>
            <span className="pipeline_title">
              {!handleUpdateTitle && title}
              {handleUpdateTitle && (
                <TextField
                  className="pipeline_title_content"
                  onBlur={handleUpdateTitle}
                  onClick={this.handleClickTitle}
                  defaultValue={title}
                  variant="outlined"
                  InputProps={{
                    className: 'pipeline_title_input',
                    endAdornment: <InputAdornment position="end" />,
                  }}
                  underline={false}
                />
              )}
            </span>
            <Typography
              className={'search ' + SearchFieldActive}
              component="div"
            >
              <Button
                onClick={this.handleSearchBar}
                className="search-button"
                disableTouchRipple
              >
                <i class="fa fa-search" aria-hidden="true"></i>
              </Button>
              <TextField
                className={'search-field '}
                placeholder="search"
                value={filterValue}
                onChange={event => this.handleUpdateSearch(event)}
                underline={false}
              />
            </Typography>
            <Typography className="filter" component="div">
              <Button
                onClick={this.onShowFilterModal}
                className="button-show-filter-modal"
              >
                <Badge
                  badgeContent={filterCellCount}
                  // style={{ backgroundColor: color }}
                  color="primary"
                  className="badge"
                >
                  <FilterList />
                </Badge>
              </Button>
            </Typography>
            <Typography className="menu" component="div">
              <div>
                <Button
                  buttonRef={node => {
                    this.anchorEl = node;
                  }}
                  aria-owns={open ? 'card-options' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleToggle}
                  className="menu-button"
                >
                  <MoreHoriz />
                </Button>
                <Menu
                  id="card-options"
                  anchorEl={this.anchorEl}
                  open={open}
                  onClose={this.handleClose}
                  className="card-options"
                  MenuListProps={{
                    disablePadding: true,
                  }}
                  PaperProps={{
                    style: {
                      padding: 0,
                      width: 197,
                      height: 'auto',
                      borderRadius: 5,
                      border: 'solid 1px #f4f4f4',
                      boxShadow: '5px 5px 30px 0 rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  disableAutoFocusItem
                >
                  <MenuItem
                    className="option-item"
                    onClick={event => {
                      this.handleClose(event);
                      this.onFileCopyClicked(event);
                    }}
                  >
                    <ListItemIcon className="text-icon">
                      <img src={CopyIcon} alt="" className="copy-icon" />
                    </ListItemIcon>
                    <ListItemText
                      inset
                      primary="Copy Link"
                      className="menu-title"
                    />
                  </MenuItem>

                  <MenuItem className="option-item" onClick={this.handleRemove}>
                    <ListItemIcon className="text-icon">
                      <Delete />
                    </ListItemIcon>
                    <ListItemText
                      inset
                      primary="Delete"
                      className="menu-title"
                    />
                  </MenuItem>
                  <MenuItem disabled={true}>
                    <p className="info-text">
                      {`This pipeline is ${pipelineType}. You can only change it by creating a new pipeline`}
                    </p>
                  </MenuItem>
                </Menu>
              </div>
            </Typography>
          </Grid>
          <Grid className="pipe_benchmark" item xs={12}>
            <DataTable
              data={userData}
              expanded={expanded}
              type={3}
              index={this.props.id}
              isFullScreenPipeline={isFullScreenPipeline}
              onShowSlidePane={this.props.showSlide}
              handleSettings={this.handleSettings}
              showCheckbox={showCheckbox}
              benchmark={benchmark}
              userAction={this.handleUserAction}
              pid={this.props.pid}
              pipelineId={this.props.pipelineId}
              pipeline={this.props.pipeline}
              filterCells={this.props.filterCells}
            />
          </Grid>
        </Grid>
        {showFilterModal && (
          <FilterModal
            show={showFilterModal}
            onHide={this.onCloseFilterModal}
            onSkip={this.onSkipFilterModal}
            type={pipelineType}
          />
        )}
      </Grid>
    );
  }
}

PipeLine.contextTypes = {
  t: PropTypes.func,
};

PipeLine.propTypes = {
  showSlide: PropTypes.func,
};

PipeLine.defaultProps = {
  showSlide: () => {},
};
