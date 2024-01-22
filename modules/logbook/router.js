import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.use(auth.verifikasiToken)
router.post('/createLogbook/:id', controller.createLogbook);
router.get('/getDataLogbook', controller.getDataLogbook);
router.get('/getDataLogbookById/:id', controller.getDataLogbookById);
router.get('/getDataLogbookByUserId/:date', controller.getDataLogbookByUserId)
router.get('/getDataLogbookByDate/:date', controller.getDataLogbookByDate);
router.get('/getDataLogbookByDateAndNeedAproval/:date', controller.getDataLogbookByDateAndNeedAproval);
router.get('/getDataLogbookForDashboard', controller.getDataLogbookForDashboard);
router.get('/getDataLogbookByToken', controller.getDataLogbookByToken);
router.put('/revisiLogbook/:id', controller.revisiLogbook);
router.put('/accLogbook/:id', controller.accLogbook);
// router.delete('/:id', controller.deleteUser);

export default router