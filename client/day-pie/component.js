import React from "react";
import {transform} from "./helpers";

import {VictoryPie} from 'victory';

const colors = {
  asleep: "blue",
  eating: "red",
  awake: "white",
  left: "white",
  na: "gray"
};

function color(event) {
  const {type} = event;

  console.log(event, type, colors[type]);
   return colors[type];
}

export default class Graph extends React.Component {
  render() {
    const {events, date} = this.props;

    const data = transform(
      events.filter(({type}) => type==="pooping"),
      date
    );

    return (
      <div>
        <VictoryPie
          data={data}
          labels={() => ""}
          style={{
            data: {fill: color},
            parent: {border: "1px solid #ccc"}
          }}
          y={({minutes}) => minutes}
        />
      </div>
    );
  }
}
