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

    static async logbookListUser(req, res){
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

    static async 

    static async createLogbook(req, res){
        try {
            let {description, keterangan} = req.body
            if (!description) throw new Error('description tidak boleh kosong/ harus diisi')
            if (!keterangan) throw new Error('keterangan tidak boleh kosong/ harus diisi')

            let hasil = await Logbook.update({description, keterangan,status:1},{where:{id:req.params.id}})
            console.log()
            
            res.status(201).json({status:"berhasil kirim logbook!!", data:hasil})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }
}

export default AttendanceController;