import React from "react";
import {getAll} from "../service";
import Graph from "./component";
import {DaySelector} from "../date-picker/component";

export default class DayPiePage extends React.Component {

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
        <DaySelector value={this.state.date} onChange={this.setDate} />
        <Graph events={this.state.events} date={this.state.date} />
      </div>
    );
  }
}
