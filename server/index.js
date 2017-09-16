const isAfter = require("date-fns/is_after");
const isBefore = require("date-fns/is_before");
const api = require("express")();
const bodyParser = require('body-parser');
const SqlStore = require("./sql-store");

api.use(bodyParser.json())

const store = new SqlStore();

api.get("/", function(req, res) {
  store.getAll(all => {
    res.json(all);
    res.end();
  });
})

api.get("/state", function(req, res) {
  store.get(state => {
    res.json(state);
    res.end();
  });
});

api.post("/state", function(req, res) {
  const data = req.body;
  store.add(data);
  res.json(data)
  res.end();
});

api.delete("/state/:id", function(req, res) {
  store.delete(req.params.id, () => {
    res.json({});
    res.end();
  });
});

module.exports = api;
