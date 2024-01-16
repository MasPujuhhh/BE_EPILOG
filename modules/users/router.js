import express from 'express';
import controller from './controller.js';

import auth from '../../middleware/auth.js'
const router = express.Router()


router.post('/login', controller.login);
router.post('/createSuper', controller.createSuper);

//users
router.use(auth.verifikasiToken)
router.get('/getDataUser', controller.getDataUser)
router.get('/getDataOnlyUser', controller.getDataOnlyUser)
router.get('/getDataUserByToken', controller.getDataUserByToken)             //user
router.post('/createUser', controller.createUser)
router.post('/createAdmin', controller.createAdmin)
router.put('/editExpiredUser', controller.updateExpiredUser)
router.put('/editUserPassword', controller.editUserPassword)
router.put('/editUserById/:id', controller.editUserById)                //user
router.put('/editUserPasswordById/:id', controller.editUserPasswordById)    //user
router.delete('/deleteUserById/:id', controller.deleteUser)
router.get('/getDataUserById/:id', controller.getDataUserById)


// router.get('/admin/dashboard', controller.adminDashboard)
export default router