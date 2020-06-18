var express = require("express");
var fetch = require("node-fetch");
var moment = require("moment");
var auth = require("../middlewares/auth");
var router = express.Router();

/* GET home page. */
router.get("/", auth, function (req, res, next) {
  fetch("https://blockchain-node-01.herokuapp.com/elections", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
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

router.get("/new", auth, function (req, res, next) {
  res.render("election/new", {
    title: "Add Election",
    style:
      "<link rel='stylesheet' href='/stylesheets/electionList.css' />" +
      '<link href="https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css" rel="stylesheet" type="text/css" />',
    thisYear: new Date().getFullYear(),
    nextYear: new Date().getFullYear() + 1,
    defaultDeadline: moment().add(1, "month").format("D/M/YYYY"),
    script:
      '<script src="https://unpkg.com/gijgo@1.9.13/js/gijgo.min.js" type="text/javascript"></script>',
  });
});

router.post("/new", function (req, res, next) {
  const { year, name, nominees, deadline } = req.body;
  let deadlineMoment = moment(deadline, "D-M-YYYY");
  if (deadlineMoment.year() !== year) {
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
        if (resData.status) {
          res.json({ status: 200 });
        } else {
          res.json({ status: 400, msg: "Election name and year is repeated" });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        next(error);
      });
  }
});

router.get("/extent/:id", auth, function (req, res, next) {
  let id = req.params.id;
  fetch(`https://blockchain-node-01.herokuapp.com/elections/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const { result } = data;

      if (result !== null) {
        let previousDeadline = moment(result.deadline).format("D/M/YYYY");
        res.render("election/extent", {
          title: "Add Election",
          style:
            "<link rel='stylesheet' href='/stylesheets/electionList.css' />" +
            '<link href="https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css" rel="stylesheet" type="text/css" />',
          name: result.name,
          year: result.year,
          nominees: result.nominees,
          deadline: previousDeadline,

          script:
            '<script src="https://unpkg.com/gijgo@1.9.13/js/gijgo.min.js" type="text/javascript"></script>',
        });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      next(error);
    });
});

router.post("/extent", function (req, res, next) {
  const { year, name, deadline } = req.body;
  let deadlineMoment = moment(deadline, "D-M-YYYY");
  let data = { year, name, newDeadline: deadlineMoment.valueOf() };
  console.log(data);
  fetch("https://blockchain-node-01.herokuapp.com/extentelection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((resData) => {
      if (resData.status) {
        res.json({ status: 200 });
      } else {
        res.json({ status: 400, msg: "Election name and year is repeated" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      next(error);
    });
});

router.get("/logout", auth, (req, res, next) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
