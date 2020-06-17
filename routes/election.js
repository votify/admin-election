var express = require("express");
var fetch = require("node-fetch");
var moment = require("moment");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  fetch("https://blockchain-node-01.herokuapp.com/elections", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let index = 0; index < data.length; index++) {
        data[index].deadline = moment(data[index].deadline).format(
          "MMM Do, YYYY"
        );
      }
      res.render("election/list", {
        title: "Election List",
        elections: data,
        style: "<link rel='stylesheet' href='/stylesheets/electionList.css' />",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      next(error);
    });
});

router.get("/new", function (req, res, next) {
  res.render("election/new", {
    title: "Add Election",
    style:
      "<link rel='stylesheet' href='/stylesheets/electionList.css' />" +
      "<link rel=”stylesheet” href=”https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.5.0/css/bootstrap-datepicker3.min.css”>",
    thisYear: new Date().getFullYear(),
    nextYear: new Date().getFullYear() + 1,
    script:
      '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.5.0/js/bootstrap-datepicker.min.js"></script>',
  });
});

router.post("/new", function (req, res, next) {
  const { year, name, nominees, deadline } = req.body;
  let deadlineMoment = moment(deadline, "D-M-YYYY");
  if (deadlineMoment.valueOf() < moment().add(1, "month").valueOf()) {
    res.json({ status: 400, msg: "deadline must be in the future" });
  } else if (deadlineMoment.year() !== year) {
    res.json({
      status: 400,
      msg: "deadline must be in the same election year",
    });
  } else {
    let data = { year, name, nominees, deadline: deadlineMoment.valueOf() };
    console.log(data);
    fetch("https://blockchain-node-01.herokuapp.com/setelection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((resData) => {
        res.json({ status: 200 });
      })
      .catch((error) => {
        console.error("Error:", error);
        next(error);
      });
  }
});

router.get("/extent", function (req, res, next) {
  res.render("election/new", {
    title: "Add Election",
    style:
      "<link rel='stylesheet' href='/stylesheets/electionList.css' />" +
      "<link rel=”stylesheet” href=”https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.5.0/css/bootstrap-datepicker3.min.css”>",
    year,

    script:
      '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.5.0/js/bootstrap-datepicker.min.js"></script>',
  });
});

module.exports = router;
