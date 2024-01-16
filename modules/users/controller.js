import User from './model.js';
import UserProfile from '../user_profile/model.js'
import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';

import userSchema from '../../helper/validator/user.js';
import loginSchema from '../../helper/validator/login.js';
import updateExpSchema from '../../helper/validator/update_exp_user.js'


class Controller{
    static async login(req, res){
        try {
            const validator = loginSchema.validate(req.body)
            if (!validator.error) {
                let {username, password} = req.body;
                let hasil = await User.findAll({
                    where:{
                        username:username
                    }
                });
                if(hasil.length != 0){
                    let cekPass = await enkrip.compare(password, hasil[0].dataValues.password)
                    if(cekPass){
                        res.status(200).json({pesan:"berhasil!", data:hasil[0].dataValues, token:jwt.enkrip(hasil[0].dataValues)});
                    }else{
                        res.status(500).json({pesan:"Username / Password Wrong!!"});
                    }
                }else{
                    res.status(500).json({pesan:"Username / Password Wrong!!"});
                }
            } else {
                console.log(validator.error.details[0].message)
                throw new Error(`${validator.error.details[0].message}`)
            }
        } catch (error) {
            res.status(500).json({error:error.message});     
        }
    }

    static async createSuper(req, res){
        try {
            const validator = userSchema.validate(req.body)
            if (validator.error) throw new Error(validator.error.details[0].message)

            let {username, password, email} = req.body;
            password = await enkrip.enkrip(password);
            let hasil = await User.create({id: nanoid(),username, password, email, role:2,isHost:true});
            let profile = await UserProfile.create({id: nanoid(), user_id:hasil.id})

            res.status(200).json({pesan:"berhasil!", data:{user:hasil, user_profile:profile} });

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error});
            } else {
                res.status(500).json({pesan:error.message});
            }  
        }
    }

    static async createAdmin(req, res){
        try {        
            const validator = userSchema.validate(req.body)
            if (validator.error) throw new Error(validator.error.details[0].message)

            let {username, password, email} = req.body;
        
            password = await enkrip.enkrip(password);
            let hasil = await User.create({id: nanoid(),username, password, email, role:1});
            let profile = await UserProfile.create({id: nanoid(), user_id:hasil.id})
            res.status(200).json({pesan:"berhasil!", data:{user:hasil, user_profile:profile} });

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }
    static async getAdminAndUser(req, res){
        try {
            const hasil = await sequelize.query(`SELECT * FROM users where "deletedAt" is null`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async createUser(req, res){
        try {  
            // console.log(req.body)
            const validator = userSchema.validate(req.body)
            if (validator.error) throw new Error(validator.error.details[0].message)

            let {username, password, email, company_role, company} = req.body;
            password = await enkrip.enkrip(password);
            let hasil = await User.create({id: nanoid(),username, password, email, role:0, company_role, company});
            // let profile = await UserProfile.create({id: nanoid(), user_id:hasil.id})
            // res.status(200).json({pesan:"berhasil!", data:{user:hasil, user_profile:profile} });
            res.status(200).json({pesan:"berhasil!", data:hasil });

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }   
        }
    }

    static async getDataUser(req, res){
        try {
            const hasil = await sequelize.query(`SELECT * from users where role != 2 and "deletedAt" is null;`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async getDataOnlyUser(req, res){
        try {
            const hasil = await sequelize.query(`SELECT * from users where role = 0 and "deletedAt" is null;`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            console.log(error);
            res.status(500).json({code:490, message:error})
        } 
    }

    static async updateExpiredUser(req, res){
        try {
            const validator = updateExpSchema.validate(req.body)
            if (validator.error) throw new Error(validator.error.details[0].message)
            let {user_id, expired_at} = req.body;
            const hasil = await User.update({expired_at}, { where: { id: user_id }, returning: true, })
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil[1][0]})

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }

    static async editUserPassword(req, res){
        try {
            let {password, user_id} = req.body;
            if (!password || !user_id) throw new Error('password and user_id required / cannot be null')
            password = await enkrip.enkrip(password);
            const hasil = await User.update({password}, { where: { id: user_id }, returning: true, })
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil[1][0]})

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }

    static async deleteUser(req, res){
        try {
            // let {user_id} = req.body;
            // if (!user_id) throw new Error('user_id cannot be an empty field')
            const hasil = await User.destroy({ where: { id: req.params.id }, returning: true })
            if (hasil.length == 0) throw new Error('data not found')
            // console.log(hasil)
            res.status(200).json({status:'OK', data:hasil[0].dataValues})
        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }


    // User
    static async getDataUserByToken(req, res){
        try {
            const hasil = await User.findOne({ where: { id: req.user.id } });
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            res.status(500).json({code:490, message:error.message})
        } 
    }

    static async getDataUserById(req, res){
        try {
            const hasil = await User.findOne({ where: { id: req.params.id } });
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            res.status(500).json({code:490, message:error.message})
        } 
    }

    static async editUserById(req, res){
        try {
            let {email, username} = req.body;
            const hasil = await User.update({email, username}, { where: { id: req.user.id }, returning: true, })
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil[1][0]})

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }

    static async editUserPasswordById(req, res){
        try {
            let {password} = req.body;
            password = await enkrip.enkrip(password);
            const hasil = await User.update({password}, { where: { id: req.user.id }, returning: true, })
            if (!hasil) throw new Error('data not found')
            res.status(200).json({status:'OK', data:hasil[1][0]})

        } catch (error) {
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(500).json({pesan:error.errors[0].message});
            } else {
                res.status(500).json({pesan:error.message});
            }
        }
    }
}

export default Controller;