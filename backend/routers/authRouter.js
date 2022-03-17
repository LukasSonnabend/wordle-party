const express = require("express");
const router = express.Router();
const Yup = require("yup");
const pool = require("../db");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(5, "Username must be at least 5 characters long")
    .max(20, "Username must be less than 20 characters long"),
  room: Yup.string().required("Room is required"),
});

router.post("/enter_room", async (req, res) => {
  console.log(req.body);
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422);
      console.log(err.errors);
    })
    .then(async (valid) => {
      if (valid) {
        const exisitingUser = await pool.query(
          `SELECT * FROM users WHERE username = $1 AND room = $2`,
          [formData.username, formData.room]
        );
        if (exisitingUser.rows.length === 0) {
          const user = await pool.query(
            `Insert into users (username, room) values ('${formData.username}', '${formData.room}')`
          );

          res.status(200).json({room_entered: true, user: {name: formData.username, points: 0}, room: formData.room, status: `Entered Room: ${formData.room}`,});
        } else
          res.status(200).json({
            room_entered: false,
            status: "User Currently Already in Room",
          });
      }
    });
});

module.exports = router;
