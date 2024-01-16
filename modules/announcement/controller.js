import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';

import Announcement from './model.js'
import AnnouncementList from '../announcement_list/model.js';

class AnnouncementController{
    static async announcementList(req, res){
        try {
            const hasil = await sequelize.query("SELECT * FROM announcement", { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async createAnnouncement(req, res){
        try {
            let {to, announcement_title, description} = req.body
            if (!to) throw new Error('to tidak boleh kosong/ harus diisi')
            if (!announcement_title) throw new Error('announcement_title tidak boleh kosong/ harus diisi')
            if (!description) throw new Error('description tidak boleh kosong/ harus diisi')

            const hasil = await sequelize.transaction(async (t) => {
                let user = []
                if (to == 'internship') {
                    user = await sequelize.query('SELECT * FROM users where role = 0', { type: QueryTypes.SELECT })
                } else {
                    user = await sequelize.query('SELECT * FROM users', { type: QueryTypes.SELECT })
                }

                const announcement_list = []
                const announcement = await Announcement.create({id:nanoid(), announcement_title, created_by:req.user.username, description},  { transaction: t })
                for (const key in user) {
                    const query = await AnnouncementList.create({id:nanoid(), user_id:user[key].id, announcement_id:announcement.id}, { transaction: t }) 
                    announcement_list.push(query)
                }

                return {user, announcement, announcement_list};
              });
            if (!hasil) throw new Error('db-error')
            res.status(201).json({status:"berhasil create announcement!!", data:hasil})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }
}

export default AnnouncementController;