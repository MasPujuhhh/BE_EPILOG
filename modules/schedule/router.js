import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.get('/getSchedule', controller.getSchedule);
router.get('/getScheduleByDate/:date', controller.getScheduleByDate);
router.post('/', controller.openSchedule);
// router.put('/:id', controller.editUserPassword);
// router.delete('/:id', controller.deleteUser);

export default router