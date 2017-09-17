import React from "react";

import {setMilliseconds, setSeconds, setMinutes, setHours, isSameDay, isBefore} from "date-fns";
import {getAll} from "../service";
import Component from "./component";

function clearTimeOfDay(date) {
  return setMilliseconds(setSeconds(setMinutes(setHours(date, 0), 0), 0), 0);
}

export default class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {events: []};
  }

  componentDidMount() {
    getAll().then(events => {
      this.setState({events})
    });
  }

  render() {

    const dates = [...new Set(this.state.events
      .map(({time}) => time)
      .map(clearTimeOfDay)
      .map(d => d.toString())
    )].map(d => new Date(d))
    .reverse();

    return (
      <div>
      {dates.map(date =>
        <Component
          key={date}
          events={this.state.events
            .filter(({time}) => isSameDay(time, date))}
          lastBefore={this.state.events
            .filter(({time}) => isBefore(time, date))
            .reverse()[0]}
          date={date}
        />
      )}
      </div>
    );
  }
}
