const router = require("express").Router();
const userLogged = require("../middleware/userLogged");
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const Review = require("../models/Review.model");

//See all rooms
router.get("/all-rooms", function (req, res, next) {
  Room.find()
    .then((results) => {
      res.render("rooms/all-rooms", { allRooms: results });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//Create a room
router.get("/create-room", userLogged, function (req, res, next) {
  res.render("rooms/create-room");
});

router.post("/create-room", userLogged, function (req, res, next) {
  Room.create({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    owner: req.body.owner,
  })
    .then((results) => {
      console.log("Room created", results);
      res.render("rooms/create-room");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//Room details first draft - results.owner coming back null
// router.get("/:id", userLogged, function (req, res, next) {
//   Room.findById(req.params.id).then((results) => {
//     console.log(results.owner);
//     User.findById(results.owner).then((ownerInfo) => {
//       console.log(ownerInfo);
//       res.render("rooms/room-details", { results, ownerInfo });
//     });
//   });
// });

//View room details -- not yet linked to creator
router.get("/:id", userLogged, function (req, res, next) {
  Room.findById(req.params.id).then((results) => {
    console.log(results);
    res.render("rooms/room-details", { results });
  });
});

//Edit room -- not yet linked to creator
router.get("/:id/edit", userLogged, function (req, res, next) {
  Room.findById(req.params.id).then((results) => {
    res.render("rooms/edit-room", { details: results });
  });
});

router.post("/:id/edit", userLogged, function (req, res, next) {
  Room.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  })
    .then((results) => {
      console.log("Changes have been made: ", results);
      res.redirect("/rooms/all-rooms");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//Delete room
router.post("/:id/delete", function (req, res, next) {
  Room.findByIdAndRemove(req.params.id)
    .then((results) => {
      console.log("The room has been deleted", results);
      res.redirect("/rooms/all-rooms");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
