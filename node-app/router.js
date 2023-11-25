const express = require('express');
const router = express.Router()
//const controller = require('./function/function')
const controller = require('./function/foodManagement')
const addCategory = require('./function/addCategory')
const addMenuItem = require('./function/addMenuItem')

//router.post('/eee', controller.eee )
router.post('/addCategory/:categoryName', addCategory.addCategory)
router.post('/addMenuItem', addMenuItem.addMenuItem)
router.get('/getAllMenu', controller.getAllMenu)
router.post('/deleteMenuItem/:itemId', controller.deleteMenuItem)
router.post('/deleteCategoryAndItems/:categoryId', controller.deleteCategoryAndItems)
router.post('/editMenuItem/:itemId', controller.editMenuItem)
router.post('/editCategory/:categoryId/:name', controller.editCategory)
module.exports = router