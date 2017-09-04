
export function getState() {
  return fetch("/api/state", {credentials: "same-origin"}).then(res => res.json())
}

export function getAll() {
  return fetch("/api/", {credentials: "same-origin"}).then(res => res.json())
}

export function setState(data) {
  return fetch("/api/state",  {
    credentials: "same-origin",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => res.json())
}
