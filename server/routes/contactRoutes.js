const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { validateContact } = require("../middleware/validate");
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");


router.use(validateToken)
router.route("/").get(getContacts).post(validateContact,createContact);
router.route("/:id").get(getContact).put(validateContact,updateContact).delete(deleteContact);

module.exports = router;
