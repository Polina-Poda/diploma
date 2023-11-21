const express = require('express');
const router = express.Router()
//const controller = require('./function/function')
const controller = require('./function/foodManagement')

//router.post('/eee', controller.eee )
router.post('/addCategory/:categoryName', controller.addCategory )
router.post('/addMenuItem/:categoryName/:name/:weight/:calories', controller.addMenuItem )
router.get('/getAllMenu', controller.getAllMenu )
router.post('/deleteMenuItem/:itemId', controller.deleteMenuItem )
router.post('/deleteCategoryAndItems/:categoryId', controller.deleteCategoryAndItems )
router.post('/editMenuItem/:itemId', controller.editMenuItem )
router.post('/editCategory/:categoryId/:name', controller.editCategory )
module.exports = router