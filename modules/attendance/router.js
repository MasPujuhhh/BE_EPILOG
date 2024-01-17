import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.use(auth.verifikasiToken)
// router.post('/:id', controller.createLogbook);
router.get('/getDataAttendance', controller.getDataAttendance);
router.get('/getDataAttendanceByID/:id', controller.getDataAttendanceById);
router.get('/getDataAttendanceByDate/:date', controller.getDataAttendanceByDate);
// router.get('/', controller.logbookListUser);
// router.put('/:id', controller.editUserPassword);
// router.delete('/:id', controller.deleteUser);

export default router