import React from "react";
import {getAll, setState, deleteEvent} from "../service";
import List from "./component";
import {DaySelector} from "../date-picker/component";
import TimePicker from "../time-picker/component";
import {getHours, getMinutes, setMinutes, setHours} from "date-fns";

const types = [
  {type: "awake", desc: "våknet"},
  {type: "asleep", desc: "sovnet"},
  {type: "eating", desc: "spiste"},
  {type: "pooping", desc: "bæsjet"}
];

class AddEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: "awake",
      hours: getHours(props.date),
      minutes: getMinutes(props.date),
    };
  }

  onChangeType = ({target}) => {
    const {value} = target;
    this.setState({type: value});
  }

  onChangeTime = ({target}) => {
    const {name, value} = target;
    this.setState({[name]: value})
  }

  onClick = () => {
    this.props.onAdd(this.state);
  }

  render() {
    return (
    <div>
      Tuva
      <select value={this.state.type} onChange={this.onChangeType}>
        {types.map(({type, desc}) =>
          <option key={type} value={type}>{desc}</option>
        )}
      </select>
      Kl.
      <TimePicker
        hours={getHours(this.props.date)}
        minutes={getMinutes(this.props.date)}
        onChange={this.onChangeTime}
      />
      <button onClick={this.onClick}>Legg til</button>
    </div>);
  }
}

export default class DayList extends React.Component {

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

  onDelete = (id) => {
    if (confirm("Er du sikker?")) {
      deleteEvent(id).then(() => {
        getAll().then(events => {
          this.setState({events});
        });
      });
    }
  }

  onAdd = ({type, hours, minutes}) => {
    const time = setMinutes(setHours(this.state.date, hours), minutes);
    setState({type, time})
      .then(() => {
        getAll().then(events => {
          this.setState({events})
        })
      });
  }

  render() {
    return (
      <div>
        <DaySelector value={this.state.date} onChange={this.setDate} />
        <List events={this.state.events} date={this.state.date} onDelete={this.onDelete} />
        <AddEvent date={this.state.date} onAdd={this.onAdd}/>
      </div>
    );
  }
}
;
