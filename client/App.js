import {subMinutes, format, getMinutes, getHours, setMinutes, setHours} from "date-fns";
import React from "react";
import DayPiePage from "./day-pie/page";
import * as service from "./service";

import { Route, Link, withRouter } from "react-router-dom";

const SET_STATE = 'SET_STATE';



class Store {

  constructor() {
    this.state = {};
  }

  getState() {
    return {...this.state};
  }

  reduce(state, {type, data}) {
    switch (type) {
      case SET_STATE:
        return {...data};
      default:
        return {...state};
    }
  }

  dispatch(action) {
    const nextState = this.reduce(this.state || {}, action);
    this.state = {...nextState};

    this.listeners.forEach(listener => {
      listener();
    });
  }

  register(listener) {
    this.listeners = this.listeners || [];
    this.listeners.push(listener);
  }

  unregister(listener) {
    if (this.listeners) {
      const i = this.listeners.indexOf(listener);

      if (i >= 0) {
        this.listeners.splice(i, 1);
      }
    }
  }
}

const store = new Store();

const onAction = (data) => {
  service.setState(data).then(() => {
    store.dispatch({
      type: SET_STATE,
      data
    });
  });
}

const connectToStore = ({store, onEnter}) => {
  return (Component) => class ConnectToStores extends React.Component {

    constructor(props) {
      super(props);
      this.state = store.getState();
    }

    componentDidMount() {
      store.register(this.onStoreChanged)

      if (onEnter) {
        onEnter();
      }
    }

    componentWillUnmount() {
      store.unregister(this.onStoreChanged);
    }

    onStoreChanged = () => {
      this.setState(store.getState());
    }

    render() {
      return (<Component {...this.state} />);
    }
  };
}

const status = (type) => ({
  awake: "Nå er Tuva våken",
  asleep: "Nå sover Tuva",
  eating: "Nå spiser Tuva"
}[type] || `Unkjent statuskode '${type}'`);

const formVerb = (type) => ({
  awake: "våknet",
  asleep: "sovnet",
  eating: "startet"
}[type] || `Unkjent statuskode '${type}'`);

const formatTime = (time) => "kl. " + format(time, "HH.mm");

const Header = ({type, time}) => (
  <p>{status(type)}. Hun {formVerb(type)} {formatTime(time)}.</p>
);

function onEnter() {
  service.getState().then(data =>
    store.dispatch({
      type: SET_STATE,
      data
    })
  );
}

const Dashboard = connectToStore({store, onEnter})(({type, time}) => (
  <div>
    <Header type={type} time={time} />
    <div>
      <Link to="/awake">Tuva våknet</Link>

      <br /><br />

      <Link to="/asleep">Tuva sovnet</Link>

      <br /><br />

      <Link to="/eating">Tuva spiser</Link>

      <br /><br />

      <Link to="/day-pie">Dagens pai</Link>
    </div>
  </div>
));

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

const Register = withRouter(class Reg extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      minutes: getMinutes(new Date()),
      hours: getHours(new Date()),
    }
  }

  onClick = (time) => {
    const {type, history} = this.props;
    onAction({type, time})
    history.push("/");
  }

  onChange = ({target}) => {
    const {name, value} = target;


    this.setState({[name]: value})
  }

  render() {
    const {title} = this.props;

    return (
      <div>
        <p>{title}</p>
        <button onClick={() => this.onClick(new Date)}>Nå</button>
        <button onClick={() => this.onClick(subMinutes(new Date(), 5))}>-5 min</button>
        <button onClick={() => this.onClick(subMinutes(new Date(), 10))}>-10 min</button>
        <br /><br />
        <button onClick={() => this.onClick(setHours(setMinutes(new Date(), this.state.minutes), this.state.hours))}>Klokken:</button>
        <TimePicker hours={this.state.hours} minutes={this.state.minutes} onChange={this.onChange}/>
      </div>
    )
  }
});

const RegisterAwake = () => (
  <Register type="awake" title="Tuva våknet" />
);

const RegisterAsleep = () => (
  <Register type="asleep" title="Tuva sovnet" />
)

const RegisterEating = () => (
  <Register type="eating" title="Tuva spiser" />
)

export default class App extends React.Component {

  render() {
    return (
      <div>
        <Route exact path="/" component={Dashboard} />
        <Route path="/awake" component={RegisterAwake}/>
        <Route path="/asleep" component={RegisterAsleep}/>
        <Route path="/eating" component={RegisterEating} />
        <Route path="/day-pie" component={DayPiePage} />
      </div>
    )
  }

}
