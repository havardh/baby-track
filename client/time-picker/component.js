import React from "react";

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

const TimePicker = ({hours, minutes, onChange}) => (
  <span>
    <select name="hours" defaultValue={hours} onChange={onChange}>
      {Array.apply(null, {length: 24}).map(Number.call, Number).map((hour) => (
        <option key={hour} value={hour}>{zeroPad(hour, 2)}</option>
      ))}
    </select>
    <select name="minutes" defaultValue={minutes} onChange={onChange}>
      {Array.apply(null, {length: 60}).map(Number.call, Number).map((minute) => (
        <option key={minute} value={minute}>{zeroPad(minute, 2)}</option>
      ))}
    </select>
  </span>
)

export default TimePicker;
