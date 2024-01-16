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
    static async todoListByAdmin(req, res){
        try {
            const hasil = await sequelize.query(`select`, { type: QueryTypes.SELECT });

            const data = {};
            hasil.forEach(item => {
                const key = `${item.id}_${item.todo_id}`;
                if (!data[key]) {
                    data[key] = { ...item, users:[{user_id:item.user_id, username:item.username}]};
                } else {
                    data[key].users.push({user_id:item.user_id, username:item.username})
                }
            });
            const outputData = Object.values(data);

            res.status(200).json({status:'OK', data:outputData})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async todoListDetailByAdmin(req, res){
        try {
            const hasil = await sequelize.query(`select * from todo_list tl
            left join todo t on tl.todo_id = t.id
            left join list l on tl.list_id = l.id
            left join user_list ul on ul.todo_id = tl.todo_id 
            left join users u on ul.user_id = u.id 
            where tl.todo_id = '${req.params.id}'`, {type: QueryTypes.SELECT})

            res.status(200).json({status:'OK', data:hasil})
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

    static async todoListByIdforUser(req, res){
        try {
            const todo = await sequelize.query(`select t.* from todo t
            left join user_list ul on ul.todo_id = t.id
            left join users u on ul.user_id = u.id
            where ul.user_id = '${req.user.id}'`, {type: QueryTypes.SELECT})

            // const hasil = await sequelize.query(`select  tl.id, tl.todo_id, t.title, t.status, t.due_date, t.created_by ,l.id, l.description , l.done, ul.user_id, u.username from todo_list tl
            // join todo t on t.id = tl.todo_id 
            // join list l on l.id = tl.list_id
            // join user_list ul on ul.todo_id = t.id
            // join users u on u.id = ul.user_id
            // where ul.user_id = '${req.user.id}'`, {type: QueryTypes.SELECT})

            res.status(200).json({status:'OK', data:todo})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }


    static async todoListDetail(req, res){
        try {
            const hasil = await sequelize.query(`select * from todo_list tl
            left join list l on tl.list_id = l.id
            where tl.todo_id = '${req.params.id}'`, {type: QueryTypes.SELECT})

            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async createTodo(req, res){
        try {
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

            // const todo_list = await sequelize.query(`select * from todo_list where list_id='${list[1][0].id}'`, {type: QueryTypes.SELECT})
            // const todo = await sequelize.query(`select * from todo where id='${todo_list[0].todo_id}'`, {type: QueryTypes.SELECT})
            // const arr_todo_list = await sequelize.query(`select * from todo_list tl
            // left join list l on tl.list_id = l.id
            // where tl.todo_id = '${todo[0].id}'`, {type: QueryTypes.SELECT})

            // let count = 0
            // for (const key in arr_todo_list) {
            //     if (arr_todo_list[key].done == true) {
            //         count++
            //     }
            // }
            // // if (count == arr_todo_list.length) {
            // //     await 
            // // }
            // console.log(count)
            // console.log(arr_todo_list.length)

            res.status(200).json({status:'list done!!', data:list[1][0]})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async completeListTodo(req, res){
        try {
            if (req.params.id == ':id') throw 'id kosong'
            const list = await Todo.update({status:true}, {where:{id:req.params.id}, returning:true})
            if(list[0] == 0) throw "id tidak ada"
            res.status(200).json({status:'todo done!!', data:list[1][0]})
        } catch (error) {
            res.status(500).json({code:490, message:error})
        } 
    }
}

export default TodoController;