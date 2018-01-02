import React from "react";
import {VictoryArea, VictoryChart, VictoryTheme} from 'victory';
import {format, subSeconds, setSeconds, setMinutes, setHours} from "date-fns";

const colors = {
  asleep: "blue",
  eating: "red",
  awake: "white",
  left: "white",
  na: "gray"
};

function filter(events, type, lastBefore) {
  const filteredEvents = [];

  if (lastBefore && lastBefore.type == type) {
    filteredEvents.push({ x: setHours(setMinutes(setSeconds(events[0].time, 0), 0), 0), y: 1});
    filteredEvents.push({ x: subSeconds(events[0].time, 1), y: 1})
    filteredEvents.push({ x: new Date(events[0].time), y: 0})
  } else {
    filteredEvents.push({ x: setHours(setMinutes(setSeconds(events[0].time, 0), 0), 0), y: 0});
  }

  for (let i=0; i<events.length; i++) {
    let event = events[i];
    let nextEvent = events[i+1];

    if (event.type == type) {
      if (!nextEvent) {
        filteredEvents.push({ x: subSeconds(event.time, 1), y: 0})
        filteredEvents.push({ x: new Date(event.time), y: 1 });
        filteredEvents.push({ x: new Date(setSeconds(setMinutes(setHours(event.time, 23), 59), 58)), y: 1})
        filteredEvents.push({ x: setSeconds(setMinutes(setHours(event.time, 23), 59), 59), y: 0})
      } else if (nextEvent) {
        filteredEvents.push({ x: subSeconds(event.time, 1), y: 0})
        filteredEvents.push({ x: new Date(event.time), y: 1 });
        filteredEvents.push({ x: subSeconds(nextEvent.time, 1), y: 1})
        filteredEvents.push({ x: new Date(nextEvent.time), y: 0})
      }  else {
        console.err({i, event, nextEvent, events});
      }
    }
  }

  return filteredEvents;
}

export default class DayBar extends React.Component {
  render() {
    return (
      <div>
        <h2>{format(this.props.date, "DD-MM-YYYY")}</h2>
        <VictoryChart
          scale={{x: "time"}}
          width={400}
          height={50}
          padding={{top: 0, bottom: 0, left:0, right: 0}}
        >
          <VictoryArea
            style={{data: {fill: colors["asleep"]}}}
            data={filter(this.props.events, "asleep", this.props.lastBefore)}
          />
          <VictoryArea
            style={{data: {fill: colors["eating"]}}}
            data={filter(this.props.events, "eating", this.props.lastBefore)}
          />
        </VictoryChart>
      </div>
    )
  }
}
