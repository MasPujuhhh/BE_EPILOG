import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';

import Comment from './model.js';

class CommentContreller{
    static async commentList(req, res){
        try {
            // console.timeLog('sa')
            const hasil = await sequelize.query(`SELECT * FROM comment where "deletedAt" is null`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            // console.log(error.message);
            res.status(500).json({code:490, pesan:error})
        } 
    }

    static async commentById(req, res){
        try {
            // console.timeLog('sa')
            const hasil = await Comment.findOne({where:{id:req.params.id}})
            if (!hasil) throw new Error('data not found')
            // const hasil = await sequelize.query(`SELECT * FROM comment where id=${req.params.id}`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            // console.log(error.message);
            res.status(500).json({code:490, pesan:error.message})
        } 
    }

    static async craeteComment(req, res){
        try {
            let {user_id, logbook_id, comment} = req.body
            if (!user_id) throw new Error('user_id tidak boleh kosong/ harus diisi')
            if (!logbook_id) throw new Error('logbooka_id tidak boleh kosong/ harus diisi')
            if (!comment) throw new Error('comment tidak boleh kosong/ harus diisi')
            // if (!todos) throw new Error('todos tidak boleh kosong/ harus diisi')

            // console.log(title, deadline, users, todos)
            const hasil = await Comment.create({id:nanoid(), user_id, logbook_id, comment})
            if (!hasil) throw new Error('db-error')
            res.status(201).json({status:"berhasil membat comment!!", data:hasil})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:"date sudah dibuat"})
            } else {
                res.status(500).json({pesan:error.message})
            }
        }
    }

    static async updateComment(req, res){
        try {
            let {user_id, logbook_id, comment} = req.body
            if (!logbook_id && !user_id && !comment) throw new Error('req body kosong')

            const hasil = await Comment.update({user_id, logbook_id, comment}, { where: { id:req.params.id }, returning: true, })
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'updated!!', data:hasil[1][0]})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }

    static async deleteComment(req, res){
        try {
            const hasil = await Comment.destroy({ where: { id: req.params.id }, returning: true })
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

export default CommentContreller;