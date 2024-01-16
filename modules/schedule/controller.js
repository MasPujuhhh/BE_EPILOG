import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';

import Schedule from './model.js'
import Logbook from '../logbook/model.js';

class ScheduleController{
    static async getSchedule(req, res){
        try {
            const hasil = await sequelize.query(`SELECT * FROM schedule where "deletedAt" isnull`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getScheduleByDate(req, res){
        try {
            const hasil = await sequelize.query(`select * from schedule s 
            join logbook l on l.schedule_id = s.id
            join users u on u.id = l.user_id
            where date = '%${req.params.date}%'
            and s."deletedAt" isnull and u."deletedAt" isnull`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }
    

    static async openSchedule(req, res){
        try {
            let {date} = req.body
            if (!date) throw new Error('date tidak boleh kosong/ harus diisi')
            const hasil = await sequelize.transaction(async (t) => {
                const user = await sequelize.query('SELECT * FROM users where role = 0', { type: QueryTypes.SELECT })
                const schedule = await Schedule.create({id:nanoid(), date},  { transaction: t })
                const logbook = []
                for (const key in user) {
                    const query = await Logbook.create({id:nanoid(), user_id:user[key].id, schedule_id:schedule.id, status:0}, { transaction: t })
                    logbook.push(query)   
                }
                return {schedule, logbook};
              });
            if (!hasil) throw new Error('db-error')
            res.status(201).json({status:"berhasil open schedule!!", data:hasil})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }
}

export default ScheduleController;