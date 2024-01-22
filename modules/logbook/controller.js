import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';

import Logbook from '../logbook/model.js'
// import Logbook from '../logbook/model.js';

class AttendanceController{

    static async getDataLogbook(req, res){
        try {
            const hasil = await sequelize.query(`select l.*, s.date, u.username, u.company_role, u.fullname from logbook l
            join schedule s on s.id = l.schedule_id
            join users u on u.id = l.user_id 
            where u."deletedAt" isnull 
            order by s.date desc`, { type: QueryTypes.SELECT });

            const groupedData = {};
            hasil.forEach((item) => {
                const date = item.date
                if (!groupedData[date]) {
                    groupedData[date] = {
                        date,
                        data: [item],
                    };
                } else {
                    groupedData[date].data.push(item);
                }
            });
            const result = Object.values(groupedData);
            res.status(200).json({status:'OK', data:result})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataLogbookById(req, res){
        try {
            const hasil = await sequelize.query(`select * from logbook l 
            left join users u on u.id = l.user_id
            left join todo t on t.id = l.todo_id
            left join schedule s on s.id = l.schedule_id
            where l.id = '${req.params.id}'`, { type: QueryTypes.SELECT });
            
            // console.log(hasil[0].todo_id)
            const todo = await sequelize.query(`select * from todo t
            left join todo_list tl on t.id = tl.todo_id 
			left join list ls on ls.id = tl.list_id 
			where t.id = '${hasil[0].todo_id}'`, { type: QueryTypes.SELECT });

            const panjang = todo.length
            let bagi = 0
            // console.log(todo)
            for (let i = 0; i < todo.length; i++) {
                // console.log(todo)
                if (todo[i].done) {
                    bagi += 1
                }  
            }
            const progress = (bagi / panjang) * 100
            // console.log(progress, panjang, bagi)

            hasil[0].todo = todo
            hasil[0].progress = progress.toFixed(0)

            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataLogbookByUserId(req, res){
        try {
            const hasil = await sequelize.query(`select l.*, s.date, u.username, u.company_role, u.fullname from logbook l
            join schedule s on s.id = l.schedule_id
            join users u on u.id = l.user_id 
            where u."deletedAt" isnull and l.user_id ='${req.user.id}'
            and s.date = '%${req.params.date}%'
            order by s.date desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataLogbookForDashboard(req, res){
        try {
            const hasil = await sequelize.query(`select l.*, s.date, u.username, u.company_role, u.fullname from logbook l
            join schedule s on s.id = l.schedule_id
            join users u on u.id = l.user_id 
            where u."deletedAt" isnull 
            order by s.date desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataLogbookByDate(req, res){
        try {
            const hasil = await sequelize.query(`select l.*, s.date, u.username, u.company_role, u.fullname from logbook l
            join schedule s on s.id = l.schedule_id
            join users u on u.id = l.user_id 
            where u."deletedAt" isnull and s.date = '%${req.params.date}%'
            order by s.date desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }
    static async getDataLogbookByDateAndNeedAproval(req, res){
        try {
            const hasil = await sequelize.query(`select l.*, s.date, u.username, u.company_role, u.fullname from logbook l
            join schedule s on s.id = l.schedule_id
            join users u on u.id = l.user_id 
            where u."deletedAt" isnull and s.date = '%${req.params.date}%'
            and status = 1
            order by s.date desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataLogbookByToken(req, res){
        try {
            const hasil = await sequelize.query(`select l.*, s.date, u.username, u.company_role, u.fullname from logbook l
            join schedule s on s.id = l.schedule_id
            join users u on u.id = l.user_id 
            where l.user_id='${req.user.id}'
            and u."deletedAt" isnull 
            order by s.date desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async createLogbook(req, res){
        try {
            let {description, keterangan, todo_id} = req.body
            if (!description) throw new Error('description tidak boleh kosong/ harus diisi')
            if (!keterangan) throw new Error('keterangan tidak boleh kosong/ harus diisi')
            if (!todo_id) throw new Error('todo_id tidak boleh kosong/ harus diisi')

            let hasil = await Logbook.update({description, keterangan, todo_id, status:1},{where:{id:req.params.id}})
            
            res.status(201).json({status:"berhasil kirim logbook!!", data:hasil})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }

    static async revisiLogbook(req, res){
        try {
            // let {description, keterangan} = req.body
            // if (!description) throw new Error('description tidak boleh kosong/ harus diisi')
            // if (!keterangan) throw new Error('keterangan tidak boleh kosong/ harus diisi')

            let hasil = await Logbook.update({status:2},{where:{id:req.params.id}})
            
            res.status(201).json({status:"berhasil update logbook!!", data:hasil})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }

    static async accLogbook(req, res){
        try {
            // let {description, keterangan} = req.body
            // if (!description) throw new Error('description tidak boleh kosong/ harus diisi')
            // if (!keterangan) throw new Error('keterangan tidak boleh kosong/ harus diisi')

            let hasil = await Logbook.update({status:3},{where:{id:req.params.id}})
            res.status(201).json({status:"berhasil update logbook!!", data:hasil})
        } catch (error) {
            console.log(error)
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }
}

export default AttendanceController;