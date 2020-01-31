import React from 'react';
import Helmet from 'react-helmet';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Button } from '@material-ui/core';
import { sizing } from '@material-ui/system';
export default class Example extends React.Component {
  static defaultProps = {
    numberOfMonths: 2,
  };

  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = this.getInitialState();
    this.state = {
      isOpen: false,
      buttonValue: 'Selected',
    };
  }

  componentWillMount() {
    const { from, to } = this.state;
    if (this.state.from && this.state.to) {
      this.setState({
        buttonValue: `Selected from ${from.toLocaleDateString()} to
        ${to.toLocaleDateString()}`,
      });
    }
  }
  getInitialState() {
    return {
      from: undefined,
      to: undefined,
    };
  }
  /**
   *
   * To make start date and end date format to match with database.
   * @param {*} tDate
   */
  generateDate(tDate) {
    var d = tDate.toLocaleDateString().split('/');
    var y = d.splice(-1)[0];
    d.splice(0, 0, y);
    let cd = d.map(i => (i < 10 ? '0'.concat(i) : i));
    var date = cd.join('-');
    return date;
  }
  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);

    if (range.from && range.to) {
      const start = this.generateDate(range.from);
      const end = this.generateDate(range.to);
      this.props.setDateRange(start, end);
    }
  }
  /**
   * Reset click to format value state of filtermodal
   */
  handleResetClick() {
    this.setState(this.getInitialState());
    this.props.setDateRange();
  }

  onToggleDatePicker = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { from, to, isOpen } = this.state;
    const modifiers = { start: from, end: to };
    const buttonValue =
      from && to
        ? `Selected from ${from.toLocaleDateString()} to
    ${to.toLocaleDateString()}`
        : `Select one date or range`;
    return (
      <div>
        <Button
          variant="outlined"
          onClick={this.onToggleDatePicker}
          size="medium"
          style={{ minHeight: '67px' }}
          className="date"
        >
          {buttonValue}
        </Button>
        {isOpen && (
          <div className="Range" minHeight="67px">
            <p>
              {!from && !to && 'Please select the first day.'}
              {from && !to && 'Please select the last day.'}
              {from &&
                to &&
                `Selected from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}
              {from && to && (
                <button className="link" onClick={this.handleResetClick}>
                  Reset
                </button>
              )}
            </p>
            <DayPicker
              className="Selectable"
              numberOfMonths={this.props.numberOfMonths}
              selectedDays={[from, { from, to }]}
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
            />
            <Helmet>
              <style>
                {`
                .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                    background-color: #f0f8ff !important;
                    color: #f2568d;
                }
                
                .Selectable .DayPicker-Day {
                    border-radius: 0 !important;
                }
                .Selectable .DayPicker-Day--start {
                    
                    background-color: #f2568d !important;
                    color: #F0F8FF;
                    border-top-left-radius: 50% !important;
                    border-bottom-left-radius: 50% !important;
                }
                .Selectable .DayPicker-Day--end {
                    background-color: #f2568d !important;
                    color: #F0F8FF;
                    border-top-right-radius: 50% !important;
                    border-bottom-right-radius: 50% !important;
                }`}
              </style>
            </Helmet>
          </div>
        )}
      </div>
    );
  }
}
