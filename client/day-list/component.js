import React from "react";
import format from "date-fns/format";
import isSameDay from 'date-fns/is_same_day';

const formVerb = (type) => ({
  awake: "våknet",
  asleep: "sovnet",
  eating: "spise",
  pooping: "bæsjet"
}[type] || `Unkjent statuskode '${type}'`);

export default class List extends React.Component {

  render() {

    const {events, date} = this.props;

    const dayEvents = events
      .filter(({time}) => isSameDay(time, date));

    return (
      <ul>
        {dayEvents.map(event => (
          <li key={event.id}>
            Tuva&nbsp;
            {formVerb(event.type)}&nbsp;
            kl.&nbsp;{format(event.time, "HH:mm")}
            <button onClick={() => this.props.onDelete(event.id)}>X</button>
          </li>
        ))}
      </ul>
    );
  }

}
