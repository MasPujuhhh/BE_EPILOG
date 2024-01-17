import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';

import Logbook from '../logbook/model.js'
// import Logbook from '../logbook/model.js';

class AttendanceController{

    static async getDataAttendance(req, res){
        try {
            const kehadiran = await sequelize.query(`select u.*, count(l.status) as jumlah_absen  from logbook l 
            left join users u on u.id = l.user_id  
            group by u.id`, { type: QueryTypes.SELECT });

            const alfa = await sequelize.query(`select u.*, count(l.status) as jumlah_alfa  from logbook l 
            left join users u on u.id = l.user_id  
            where l.keterangan isnull 
            group by u.id`, { type: QueryTypes.SELECT });

            const masuk = await sequelize.query(`select u.*, count(l.status) as jumlah_masuk  from logbook l 
            join users u on u.id = l.user_id  
            where l.keterangan = 1 
            group by u.id`, { type: QueryTypes.SELECT });

            const izin = await sequelize.query(`select u.*, count(l.status) as jumlah_izin from logbook l 
            left join users u on u.id = l.user_id 
            where l.keterangan = 0
            group by u.id`, { type: QueryTypes.SELECT });

            for (const k in kehadiran) {
                if(alfa.length){
                    for (const a in alfa) {
                        if (kehadiran[k].id == alfa[a].id) {
                            kehadiran[k].jumlah_alfa = alfa[a].jumlah_alfa
                        } else {
                            kehadiran[k].jumlah_alfa = '0'
                        }
                    }
                } else {
                    kehadiran[k].jumlah_alfa = '0'
                }

                if (masuk.length) {
                    for (const m in masuk) {
                        if (kehadiran[k].id == masuk[m].id) {
                            kehadiran[k].jumlah_masuk = masuk[m].jumlah_masuk
                        } else {
                            kehadiran[k].jumlah_masuk = '0'
                        }
                    }
                } else {
                    kehadiran[k].jumlah_masuk = '0'
                }

                if (izin.length) {
                    for (const i in izin) {
                        // console.log(izin[i])
                        if (kehadiran[k].id == izin[i].id) {
                            kehadiran[k].jumlah_izin = izin[i].jumlah_izin
                        } else {
                            kehadiran[k].jumlah_izin = '0'
                        }
                    }
                } else {
                    kehadiran[k].jumlah_izin = '0'
                }
            }
            res.status(200).json({status:'OK', data:kehadiran})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataAttendanceByDate(req, res){
        try {
            const hasil = await sequelize.query(`select * from logbook l 
            left join schedule s on s.id = l.schedule_id 
            left join users u on u.id = l.user_id
            where s.date = '%${req.params.date}%'
            order by date desc`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataAttendanceById(req, res){
        try {
            const hasil = await sequelize.query(`select * from logbook l 
            left join schedule s on s.id = l.schedule_id 
            left join users u on u.id = l.user_id
            where u.id = '${req.params.id}'
            order by date desc`, { type: QueryTypes.SELECT });

            const groupedData = {};
            hasil.forEach((item) => {
                const user_id = item.user_id
                if (!groupedData[user_id]) {
                    groupedData[user_id] = {
                        ...item,
                        data: [{
                            date:item.date,
                            status:item.keterangan
                        }],
                    };
                } else {
                    groupedData[user_id].data.push({
                        date:item.date,
                        keterangan:item.keterangan
                    });
                }
            });
            const result = Object.values(groupedData);
            res.status(200).json({status:'OK', data:result})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

}

export default AttendanceController;