import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { DATE, QueryTypes } from 'sequelize';

import Todo from './model.js'
import ListModel from '../list/model.js';
import TodoListModel from '../todo_list/model.js';
import UserList from '../user_list/model.js';

class TodoController{
    static async getTodo(req, res){
        try {
            const hasil = await sequelize.query(`select * from todo t where "deletedAt" isnull order by "createdAt" desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getTodoDone(req, res){
        try {
            const hasil = await sequelize.query(`select * from todo t where "deletedAt" isnull and todo_done = true order by "createdAt" desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getTodoDetailById(req, res){
        try {
            const hasil = await sequelize.query(`select * from todo_list tl
            left join todo t on tl.todo_id = t.id
            left join list l on tl.list_id = l.id
            left join user_list ul on ul.todo_id = tl.todo_id 
            left join users u on ul.user_id = u.id 
            where tl.todo_id = '${req.params.id}'`, {type: QueryTypes.SELECT})

            const data = {};
            hasil.forEach(item => {
                const key = `${item.id}_${item.todo_id}`;
                if (!data[key]) {
                    data[key] = { title:item.title,description:item.description, done:item.done, todo_done:item.todo_done, status:item.status , data:[item]};
                } else {
                    data[key].data.push(item)
                }
            });
            const outputData = Object.values(data);



            // console.log(outputData)
            res.status(200).json({status:'OK', data:outputData})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async todoListByIdforAdmin(req, res){
        try {
            let {user_id} = req.body
            const hasil = await sequelize.query(`select  tl.id, tl.todo_id, t.title, t.status, t.due_date, t.created_by ,l.id, l.description , l.done from todo_list tl
            join todo t on t.id = tl.todo_id 
            join list l on l.id = tl.list_id
            join user_list ul on ul.todo_id = t.id
            join users u on u.id = ul.user_id
            where ul.user_id = '${user_id}'`, {type: QueryTypes.SELECT})

            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }


    static async getTodoByToken(req, res){
        try {
            const hasil = await sequelize.query(`select * from todo_list tl
            left join list l on tl.list_id = l.id
            where tl.todo_id = '${req.user.id}'`, {type: QueryTypes.SELECT})

            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async createTodo(req, res){
        try {
            // console.log(req.user)
            let {title, deadline, users, todos} = req.body
            if (!title) throw new Error('title tidak boleh kosong/ harus diisi')
            if (!deadline) throw new Error('deadline tidak boleh kosong/ harus diisi')
            if (!users) throw new Error('users tidak boleh kosong/ harus diisi')
            if (!todos) throw new Error('todos tidak boleh kosong/ harus diisi')

            const hasil = await sequelize.transaction(async (t) => {

                let due_date = new Date()
                due_date.setDate(due_date.getDate() + deadline)
                const todo = await Todo.create({id:nanoid(), created_by:req.user.username, title, todo_done:0, due_date},  { transaction: t })
            
                const list = []
                for (const key in todos) {
                    const query = await ListModel.create({id:nanoid(), description:todos[key], done:false}, { transaction: t })
                    await TodoListModel.create({id:nanoid(), todo_id:todo.id, list_id:query.id}, { transaction: t })
                    list.push(query)   
                }

                const user = []
                for (const key in users) {
                    const query = await UserList.create({id:nanoid(), todo_id:todo.id, user_id:`${users[key]}`}, { transaction: t })
                    user.push(query)   
                }
                return {todo, list, user};
              });
            if (!hasil) throw new Error('db-error')
            res.status(201).json({status:"berhasil open schedule!!", data:hasil})
        } catch (error) {
            console.log(error)
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error})
            }
        }
    }


    static async doneOneListTodo(req, res){
        try {
            if (req.params.id == ':id') throw 'id kosong'
            const list = await ListModel.update({done:true}, {where:{id:req.params.id}, returning:true})
            res.status(200).json({status:'list done!!', data:list[1][0]})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async completeListTodoById(req, res){
        try {
            let data = await sequelize.query(`select * from todo where "deletedAt" isnull and id ='${req.params.id}'`, {type: QueryTypes.SELECT})

            const currentDate = new Date();
            const newDate = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);

            let status
            if (data[0].due_date < newDate) {
                status = 0
            } else {
                status = 1
            }

            if (req.params.id == ':id') throw 'id kosong'
            const list = await Todo.update({todo_done:true, status}, {where:{id:req.params.id}, returning:true})
            if(list[0] == 0) throw "id tidak ada"
            res.status(200).json({status:'todo done!!', data:list[1][0]})
        } catch (error) {
            res.status(500).json({code:490, message:error})
        } 
    }

    static async deleteTodo(req, res){
        try {
            const hasil = await Todo.destroy({ where: { id: req.params.id }, returning: true })
            if (hasil.length == 0) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil[0].dataValues})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }
}

export default TodoController;