const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

//@dec Get all contacts 
//@route Get /api/contacts
//@access private

const getContacts = asyncHandler(async(req, res) => {
  const contacts = await Contact.find({user_id: req.user.id})
  res.status(200).json(contacts);
})

//@dec Create new contact 
//@route POST /api/contacts
//@access private

const createContact = asyncHandler (async(req, res) => {
    console.log("The request body is :", req.body)
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400)
        throw new Error("All feilds are mandatory")
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id
    })
  res.status(201).json(contact);
})

//@dec Get a contact 
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async(req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found")
  }
  res.status(200).json(contact);
})

//@dec Update contact 
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async(req, res) => {
   const contact = await Contact.findById(req.params.id); //first we have to fetch the contact to upadte it.
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found")
  }

  if(contact.user_id.toString() !== req.user.id) { //before updating the contact on line 63, we have created a check if same user if updating the contact? 
    res.status(403)
    throw new Error("User don't have permission to update other user contacts")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id, req.body, {new: true})

  res.status(200).json(updatedContact);
})

//@dec Delete contact 
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async(req, res) => {
  const contact = await Contact.findById(req.params.id); //first we have to fetch the contact to upadte it.
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found")
  }

  if(contact.user_id.toString() !== req.user.id) { 
    res.status(403)
    throw new Error("User don't have permission to delete other user contacts")
  }

  await Contact.deleteOne({_id: req.params.id}); 
  res.status(200).json(contact);
})

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact }