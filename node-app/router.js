const express = require('express');
const router = express.Router()
const dotenv = require('dotenv');
dotenv.config();

const addCategory = require('./functionWithFood/addCategory')
const addMenuItem = require('./functionWithFood/addMenuItem')
const getAllMenu = require('./functionWithFood/getAllMenu')
const deleteMenuItem = require('./functionWithFood/deleteMenuItem')
const deleteCategoryAndItems = require('./functionWithFood/deleteCategoryAndItems')
const editMenuItem = require('./functionWithFood/editMenuItem')
const editCategory = require('./functionWithFood/editCategory')
const selfRegistrationUser = require('./registration/selfRegistrationUser')
const selfRegistrationWorker = require('./registration/selfRegistrationWorker')
const sixDigitCodeGeneration = require('./login/loginCode')
const generateToken = require('./login/generateToken')
const googleRegistration = require('./registration/registrationGoogle')


router.post('/addCategory/:categoryName', addCategory.addCategory)
router.post('/addMenuItem', addMenuItem.addMenuItem)
router.get('/getAllMenu', getAllMenu.getAllMenu)
router.post('/deleteMenuItem/:itemId', deleteMenuItem.deleteMenuItem)
router.post('/deleteCategoryAndItems/:categoryId', deleteCategoryAndItems.deleteCategoryAndItems)
router.post('/editMenuItem/:itemId', editMenuItem.editMenuItem)
router.post('/editCategory/:categoryId/:name', editCategory.editCategory)
router.post('/selfRegistrationUser', selfRegistrationUser.selfRegistrationUser)
router.post('/selfRegistrationWorker', selfRegistrationWorker.selfRegistrationWorker)
router.post('/six/code/generation', sixDigitCodeGeneration.sixDigitCodeGeneration)
router.post('/generate/token', generateToken.generateToken)
router.post('/google/registration', googleRegistration.googleRegistration)

module.exports = router