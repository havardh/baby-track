import React from "react";
import {
  parse,
  getDate,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import {numbers} from "../day-pie/helpers";

function now() {
  return new Date();
}

function makeSureAtleastTwoDigits(value) {
  if (value < 10) {
    return "0" + value;
  } else {
    return value;
  }
}

export class MonthSelector extends React.Component {

  onChange = (value) => {
    if (isSameDay(value, now())) {
      this.props.onChange(now());
    } else {
      this.props.onChange(setHours(setMinutes(value, 59), 23));
    }
  }

  onNext = () => {
    this.onChange(addMonths(this.props.value, 1));
  }

  onPrev = () => {
    this.onChange(subMonths(this.props.value, 1));
  }

  render() {
    return (
      <div>
        <button onClick={this.onPrev}>&lt;</button>
        <DatePicker value={this.props.value} onChange={this.onChange} />
        <button onClick={this.onNext}>&gt;</button>
      </div>
    )
  }

}

class DatePicker extends React.Component {

  constructor(props) {
    super(props);
    const {value} = props;

    this.state = {
      date: getDate(value),
      month: getMonth(value),
      year: getYear(value),
    };
  }

  formatState() {
    const {date, month, year} = this.state;
    return new Date(year, month, date);
  }

  onChange = (e) => {
    let {name, value} = e.target;

    this.setState({[name]: value}, () => {
      this.props.onChange(this.formatState());
    });
  }

  render() {
    return (
      <span>
        <SelectFromTo name="month" from={0} to={11} value={getMonth(this.props.value)} onChange={this.onChange} />
        <SelectFromTo name="year" from={1988} to={2017} value={getYear(this.props.value)} onChange={this.onChange} />
      </span>
    )
  }
}

const SelectFromTo = ({name, value, onChange, from, to}) => (
  <select name={name} value={value} onChange={onChange}>
    {numbers(from, to).map(n => (
      <option
        key={n}
        value={n}>
        {makeSureAtleastTwoDigits(n + (name==="month" ? 1 : 0))}
      </option>
    ))}
  </select>
);
