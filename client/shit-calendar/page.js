import React from "react";
import {getAll} from "../service";
import Calendar from "./component";
import {MonthSelector} from "../month-picker/component";

export default class ShitCalendarPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { events: [], date: new Date()};
  }

  componentDidMount() {
    getAll().then(events => {
      this.setState({events})
    })
  }

  setDate = (date) => {
    this.setState({date});
  }

  render() {
    return (
      <div>
        <MonthSelector value={this.state.date} onChange={this.setDate} />
        <Calendar events={this.state.events} date={this.state.date} />
      </div>
    );
  }
}
