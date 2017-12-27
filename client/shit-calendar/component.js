import React from "react";

import {addDays, addWeeks, startOfWeek, startOfMonth, isSameDay, getDate} from "date-fns";

function shitOn(shits, date) {
  return shits.filter(({time}) => isSameDay(time, date)).length >= 1;
}

const Cell = ({date, isShit}) => (
  <td>{isShit ? "💩" : getDate(date)}</td>
)

function cellDate(firstMonday, week, day) {
  return addWeeks(addDays(firstMonday, day), week);
}

export default class Calendar extends React.Component {
  render() {
    const {events, date} = this.props;

    const data = events.filter(({type}) => type==="pooping")

    const monthStart = startOfMonth(date);
    const firstMonday = startOfWeek(monthStart);

    return (
      <div>
      <table>
        <tbody>
          {[0, 1, 2, 3, 4, 5].map(week =>
            <tr key={week}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(day =>
                <Cell
                  key={day}
                  date={cellDate(firstMonday, week, day)}
                  isShit={shitOn(data, cellDate(firstMonday, week, day))}
                />
              )}
            </tr>
          )}
        </tbody>
      </table>
      </div>
    );
  }
}
