import express from 'express';
import users from '../modules/users/router.js'
import schedule from '../modules/schedule/router.js'
import todo from '../modules/todo/router.js'
import announcement from '../modules/announcement/router.js'
import certificate from '../modules/certificate/router.js';
import comment from '../modules/comment/router.js';
import logbook from '../modules/logbook/router.js';
import attendance from '../modules/attendance/router.js'
// import openSchedule from '../../middleware/openSchedule.js';
const router = express.Router()

router.use('/user', users)
router.use('/schedule', schedule)
router.use('/todo', todo)
router.use('/announcement', announcement)
router.use('/certificate', certificate)
router.use('/comment', comment)
router.use('/logbook', logbook)
router.use('/attendance', attendance)

export default router
