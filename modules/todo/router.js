import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()


router.get('/', controller.todoListByAdmin);
router.post('/', controller.createTodo);
router.get('/admin/:id', controller.todoListDetailByAdmin);
// router.get('/tes', controller.searchTodo);
router.get('/user', controller.todoListByIdforUser);
router.get('/user/:id', controller.todoListDetail); 
router.put('/user/done/:id', controller.doneOneListTodo)
router.put('/user/completed/:id', controller.completeListTodo)

export default router