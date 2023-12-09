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
const getUserData = require('./functionWithUser/getUserData')
const getWorkerData = require('./functionWithWorker/getWorkerData')
const getAllWorker = require('./functionWithWorker/getAllWorkers')
const orderCreation = require('./functionWithOrder/orderCreation')
const getDemoWorkersData = require('./adminFunction/getDemoWorkers')
const roleEditing = require('./adminFunction/roleEditing')
const deleteDemoWorker = require('./adminFunction/deleteDemoWorker')
const workerRegistrationByAdmin = require('./adminFunction/workerRegistrationByAdmin')
const applicationApprovedUser = require('./registration/applicationApprovedUser')
const loginWithPasswordUser = require('./login/loginWithPasswordUser')
const loginWithPasswordWorker = require('./login/loginWithPasswordWorker')
const addFavoriteFood = require('./functionWithUser/addFavoriteFood')
const removeFavoriteFood = require('./functionWithUser/removeFavoriteFood');
const getFavorites = require('./functionWithFood/getFavorites');
const editUserData = require('./functionWithUser/editUserData');
const editWorkerData = require('./functionWithWorker/editWorkerData');


router.post('/addCategory', addCategory.addCategory)
router.post('/addMenuItem', addMenuItem.addMenuItem)
router.post('/deleteMenuItem', deleteMenuItem.deleteMenuItem)
router.post('/deleteCategoryAndItems', deleteCategoryAndItems.deleteCategoryAndItems)
router.post('/editMenuItem', editMenuItem.editMenuItem)
router.post('/editCategory', editCategory.editCategory)
router.get('/getAllMenu', getAllMenu.getAllMenu)


router.post('/selfRegistrationUser', selfRegistrationUser.selfRegistrationUser)
router.post('/selfRegistrationWorker', selfRegistrationWorker.selfRegistrationWorker)
router.post('/six/code/generation', sixDigitCodeGeneration.sixDigitCodeGeneration)
router.post('/generate/token', generateToken.generateToken)
router.post('/google/registration', googleRegistration.googleRegistration)
router.get('/get/user/data/:email', getUserData.getUserData)
router.get('/get/worker/data/:email', getWorkerData.getWorkerData)
router.get('/get/all/worker', getAllWorker.getAllWorker)
router.post('/order/creation', orderCreation.orderCreation)
router.get('/get/demo/workers/data/:email', getDemoWorkersData.getDemoWorkers)
router.post('/role/editing', roleEditing.roleEditing)
router.post('/delete/demo/worker', deleteDemoWorker.deleteDemoWorker)
router.post('/worker/reg/by/admin', workerRegistrationByAdmin.workerRegistrationByAdmin)
router.post('/application/approved/user', applicationApprovedUser.applicationApprovedUser)
router.post('/login/with/password/user', loginWithPasswordUser.loginWithPassword)
router.post('/login/with/password/worker', loginWithPasswordWorker.loginWithPasswordWorker)
router.post('/add/favorite/food', addFavoriteFood.addFood)
router.post('/remove/favorite/food', removeFavoriteFood.removeFood)
router.get('/get/favorites/:email', getFavorites.getFavorites)
router.post('/edit/user/data', editUserData.editUserData)
router.post('/edit/worker/data', editWorkerData.editWorkerData)


module.exports = router