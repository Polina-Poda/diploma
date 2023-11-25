const express = require('express');
const router = express.Router()

const addCategory = require('./function/addCategory')
const addMenuItem = require('./function/addMenuItem')
const getAllMenu = require('./function/getAllMenu')
const deleteMenuItem = require('./function/deleteMenuItem')
const deleteCategoryAndItems = require('./function/deleteCategoryAndItems')
const editMenuItem = require('./function/editMenuItem')
const editCategory = require('./function/editCategory')
const selfRegistrationUser = require('./function/selfRegistrationUser')

router.post('/addCategory/:categoryName', addCategory.addCategory)
router.post('/addMenuItem', addMenuItem.addMenuItem)
router.get('/getAllMenu', getAllMenu.getAllMenu)
router.post('/deleteMenuItem/:itemId', deleteMenuItem.deleteMenuItem)
router.post('/deleteCategoryAndItems/:categoryId', deleteCategoryAndItems.deleteCategoryAndItems)
router.post('/editMenuItem/:itemId', editMenuItem.editMenuItem)
router.post('/editCategory/:categoryId/:name', editCategory.editCategory)
router.post('/selfRegistrationUser', selfRegistrationUser.selfRegistrationUser)
module.exports = router