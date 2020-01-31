import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Modal,
  Paper,
  Grid,
  IconButton,
  FormControl,
  Divider,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import './FilterModal.scss';
import CreatableSelect from 'react-select/creatable';
import CustomSelect from 'react-select';
import {
  expYearList,
  eduLevelList,
  roleLevelList,
  roleFunctionList,
  skillOptionList,
  roleOptionList,
} from '../../../containers/CEnter/data';
import 'react-daterange-picker/dist/css/react-calendar.css';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';

import DateRange from './DateRange';
const moment = extendMoment(originalMoment);

/**
 * removeDropdown value is for remove dropdown indicator
 */
const removeDropdown = {
  DropdownIndicator: null,
};
const customStyles = {
  option: (provided, state) => ({
    ...provided,
  }),
  control: (provided, state) => ({
    ...provided,
    minHeight: 67,
  }),
  multiValueLabel: (styles, state) => ({
    ...styles,
    color: '#fff!important',
    borderRadius: '4px 0px 0px 4px',
    backgroundColor: '#f2568d!important',
  }),
  menuList: base => ({
    ...base,
    maxHeight: '170px',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    backgroundColor: '#f2568d!important',
    borderRadius: '0px 4px 4px 0px',
    color: '#fff!important',
  }),
};

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    position: 'absolute',
    top: `${50}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxHeight: window.innerHeight - 160,
  };
};

class FilterModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    const today = moment();
    this.state = {
      isDatePickerOpen: false,
      value: { start: '', end: '' },
      eduLevelFilter: { value: null, options: eduLevelList },
      expYearFilter: { value: null, options: expYearList },
      roleFunctionFilter: { value: null, options: roleFunctionList },
      roleLevelFilter: { value: null, options: roleLevelList },
      roleFilter: { value: null, options: roleOptionList },
      skillFilter: { value: null, options: skillOptionList },
      isAuthorized: '',
    };
  }

  setValue = (name, value) => {
    this.setState(prevState => ({ [name]: { ...prevState[name], value } }));
  };
  handleDatasSelected = name => async newValue => {
    this.setValue(name, newValue);
    // const newArray = newValue.map(e => e.value);
    // this.setState({
    //   [name]: newArray,
    // });
  };
  getItems = items => {
    return items.value ? items.value.map(item => item.value) : '';
  };
  handleClose = () => {
    const {
      eduLevelFilter,
      expYearFilter,
      roleFunctionFilter,
      roleLevelFilter,
      roleFilter,
      skillFilter,
      isAuthorized,
      value,
    } = this.state;
    let checkAuthorize;

    if (isAuthorized === '') checkAuthorize = undefined;
    else if (isAuthorized === 'Authorized') checkAuthorize = true;
    else checkAuthorize = false;
    const filterlist = {
      eduLevelFilter: this.getItems(eduLevelFilter),
      expYearsFilter: this.getItems(expYearFilter),
      roleFunctionFilter: this.getItems(roleFunctionFilter),
      roleLevelFilter: this.getItems(roleLevelFilter),
      roleFilter: this.getItems(roleFilter),
      skillFilter: this.getItems(skillFilter),
      isAuthorized: checkAuthorize,
      value,
    };

    this.props.onHide(filterlist);
  };
  handleClear = () => {
    this.setValue('eduLevelFilter', null);
    this.setValue('expYearFilter', null);
    this.setValue('roleFunctionFilter', null);
    this.setValue('roleLevelFilter', null);
    this.setValue('roleFilter', null);
    this.setValue('skillFilter', null);
    this.setState({ isAuthorized: '' });
  };

  handleChangeAuthorization = event => {
    this.setState({ isAuthorized: event.target.value });
  };

  setDateRange = (from, to) => {
    const value = { start: from, end: to };
    this.setState({ value });
  };

  render() {
    const { show, type, onSkip } = this.props;
    const {
      isAuthorized,
      eduLevelFilter,
      expYearFilter,
      roleFunctionFilter,
      roleLevelFilter,
      roleFilter,
      skillFilter,
    } = this.state;
    return (
      <Modal className="filter-modal" open={show} onClose={onSkip}>
        <div>
          <Paper className="paper-main" elevation={0} style={getModalStyle()}>
            <Divider className="divider" />
            <Grid
              container
              className="filter-list"
              direction="column"
              justify="space-between"
            >
              <Grid
                className="filter-modal-header"
                container
                alignItems="center"
                justify="space-between"
              >
                <Typography variant="h5" component="h5">
                  {'Filter by'}
                </Typography>
              </Grid>

              <Grid item xs={12} className="row">
                <FormControl
                  variant="outlined"
                  className="text_field"
                  color="primary"
                >
                  <Typography component="div" className="form-control-label">
                    {this.context.t('Date')}
                  </Typography>
                  <DateRange setDateRange={this.setDateRange} />
                </FormControl>
              </Grid>
              {type === 'External' && (
                <Grid container justify="center" spacing={5} className="row">
                  <Grid item xs={6}>
                    <FormControl variant="outlined" className="text_field">
                      <Typography
                        component="div"
                        className="form-control-label"
                      >
                        {this.context.t('Educational background')}
                      </Typography>
                      <CreatableSelect
                        placeholder="Select educational background"
                        isMulti
                        components={removeDropdown}
                        onChange={this.handleDatasSelected('eduLevelFilter')}
                        options={eduLevelFilter.options}
                        value={eduLevelFilter.value}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="outlined" className="text_field">
                      <Typography
                        component="div"
                        className="form-control-label"
                      >
                        {this.context.t('Professional work experience')}
                      </Typography>
                      <CreatableSelect
                        placeholder="Select professional work experience"
                        isMulti
                        components={removeDropdown}
                        onChange={this.handleDatasSelected('expYearFilter')}
                        options={expYearFilter.options}
                        value={expYearFilter.value}
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
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {type === 'External' && (
                <>
                  <Grid item xs={8} className="row">
                    <FormControl variant="outlined" className="text_field">
                      <Typography
                        component="div"
                        className="form-control-label"
                      >
                        {this.context.t('Current role')}
                      </Typography>
                      <CreatableSelect
                        placeholder="Select current role"
                        isMulti
                        components={removeDropdown}
                        onChange={this.handleDatasSelected(
                          'roleFunctionFilter',
                        )}
                        options={roleFunctionFilter.options}
                        value={roleFunctionFilter.value}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={8} className="row">
                    <FormControl variant="outlined" className="text_field">
                      <Typography
                        component="div"
                        className="form-control-label"
                      >
                        {this.context.t('Role level')}
                      </Typography>
                      <CreatableSelect
                        placeholder="Select role level"
                        isMulti
                        components={removeDropdown}
                        onChange={this.handleDatasSelected('roleLevelFilter')}
                        options={roleLevelFilter.options}
                        value={roleLevelFilter.value}
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
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid container justify="center" spacing={3} className="row">
                <Grid item xs={6}>
                  <FormControl variant="outlined" className="text_field">
                    <Typography component="div" className="form-control-label">
                      {this.context.t('Skills')}
                    </Typography>
                    <CreatableSelect
                      placeholder="Select skills"
                      isMulti
                      components={removeDropdown}
                      onChange={this.handleDatasSelected('skillFilter')}
                      options={skillFilter.options}
                      value={skillFilter.value}
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
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" className="text_field">
                    <Typography component="div" className="form-control-label">
                      {this.context.t('Role Interests')}
                    </Typography>
                    <CreatableSelect
                      placeholder="Select role interests"
                      isMulti
                      components={removeDropdown}
                      onChange={this.handleDatasSelected('roleFilter')}
                      options={roleFilter.options}
                      value={roleFilter.value}
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
                  </FormControl>
                </Grid>
              </Grid>

              {type === 'External' && (
                <Grid item xs={6} className="row">
                  <FormControl variant="outlined" className="text_field">
                    <Typography component="div" className="form-control-label">
                      {this.context.t('Canadian work authorization')}
                    </Typography>
                    <RadioGroup
                      aria-label="position"
                      name="position"
                      value={isAuthorized}
                      onChange={this.handleChangeAuthorization}
                      row
                    >
                      <FormControlLabel
                        value={'Authorized'}
                        control={<Radio color="primary" />}
                        label="Yes"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="Unauthorized"
                        control={<Radio color="primary" />}
                        label="No"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}
              <Grid
                item
                xs={6}
                className="row action-class"
                align-items-xs-flex-end
              >
                <Button
                  variant="outlined"
                  className="action-button"
                  color="primary"
                  onClick={this.handleClear}
                >
                  {/* <Typography component="div" className="button-action"> */}
                  {this.context.t('Clear')}
                  {/* </Typography> */}
                </Button>
                <Button
                  variant="contained"
                  className="action-button"
                  color="primary"
                  onClick={this.handleClose}
                >
                  {/* <Typography component="div" className="button-action"> */}
                  {this.context.t('Apply')}
                  {/* </Typography> */}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Modal>
    );
  }
}

FilterModal.contextTypes = {
  t: PropTypes.func,
};

FilterModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default FilterModal;
