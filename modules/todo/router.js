import express from 'express';
import controller from './controller.js';
import auth from '../../middleware/auth.js'
const router = express.Router()

router.use(auth.verifikasiToken)
router.get('/getTodo', controller.getTodo);
router.get('/getTodoDone', controller.getTodoDone);
router.post('/createTodo', controller.createTodo);
router.get('/getTodoDetailById/:id', controller.getTodoDetailById);
// router.get('/tes', controller.searchTodo);
router.get('/getTodoByToken', controller.getTodoByToken);
// router.get('/user/:id', controller.get); 
router.get('/getTodoDetailById/:id', controller.getTodoDetailById)
router.put('/doneOneListTodo/:id', controller.doneOneListTodo)
router.put('/completeListTodoById/:id', controller.completeListTodoById)
router.delete('/deleteTodo/:id', controller.deleteTodo)

export default router