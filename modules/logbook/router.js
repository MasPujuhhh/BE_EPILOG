import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.use(auth.verifikasiToken)
// router.post('/:id', controller.createLogbook);
router.get('/getDataLogbook', controller.getDataLogbook);
router.get('/getDataLogbookByDate/:date', controller.getDataLogbookByDate);
router.get('/getDataLogbookByDateAndNeedAproval/:date', controller.getDataLogbookByDateAndNeedAproval);
router.get('/getDataLogbookForDashboard', controller.getDataLogbookForDashboard);
router.get('/', controller.logbookListUser);
// router.put('/:id', controller.editUserPassword);
// router.delete('/:id', controller.deleteUser);

export default router