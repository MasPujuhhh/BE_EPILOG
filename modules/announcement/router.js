import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.get('/', controller.announcementList);
router.post('/', controller.createAnnouncement);
// router.put('/:id', controller.editUserPassword);
// router.delete('/:id', controller.deleteUser);

export default router