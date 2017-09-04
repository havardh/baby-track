import {
  compareAsc,
  isSameDay,
  isBefore,
  isAfter,
  differenceInMinutes,
  setSeconds,
  setMinutes,
  setHours,
  addMinutes,
} from "date-fns";
import {last, filter} from "lodash";

function lastEventBeforeToday(data, when) {
  return last(filter(data, ({time}) => isBefore(time, when)));
}

function allTodaysEvents(data, now) {
  return data
    .filter(({time}) => isSameDay(time, now))
    .sort((eventA, eventB) => compareAsc(eventA.time, eventB.time));
}

export function transform(data, now) {
  const events = [];
  const startOfDay = setSeconds(setMinutes(setHours(now, 0), 0), 0);
  const endOfDay = addMinutes(setSeconds(setMinutes(setHours(now, 23), 59), 0), 1);

  if (data && data.length === 0) {
    return [{
      type: "na",
      minutes: -differenceInMinutes(startOfDay, endOfDay)
    }];
  }

  let eventBeforeToday = lastEventBeforeToday(data, startOfDay);
  let todaysEvents = allTodaysEvents(data, now);

  if (todaysEvents.length === 0) {
    return [{
      type: "na",
      minutes: -differenceInMinutes(startOfDay, endOfDay)
    }];
  }

  if (isAfter(todaysEvents[0].time, startOfDay)) {
    const type = eventBeforeToday ? eventBeforeToday.type : "na";
    todaysEvents.unshift({type, time: startOfDay});
  }

  for (let i in todaysEvents) {
    const thisEvent = todaysEvents[i];
    const nextEvent = todaysEvents[parseInt(i, 10)+1] || {time: endOfDayOrNow(now, endOfDay)};

    events.push(createEvent(thisEvent.type, thisEvent.time, nextEvent.time));
  }

  if (isBefore(now, endOfDay)) {
    events.push(createEvent("na", now, endOfDay));
  }

  return events;
}

function endOfDayOrNow(now, endOfDay) {
  if (isAfter(now, endOfDay)) {
    return endOfDay;
  } else {
    return now;
  }
}

function createEvent(type, time, end) {
  const minutes = -differenceInMinutes(time, end);
  return {type, minutes};
}

export function numbers(time, end) {
  const nums = [];
  for (let i = time; i <= end; i++) {
    nums.push(i);
  }
  return nums;
}
