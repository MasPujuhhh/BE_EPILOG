import  enkrip  from '../../helper/enkrip.js';
import jwt from '../../helper/jwt.js';
import { nanoid } from 'nanoid'
import sequelize from '../../config/connection.js';
import { QueryTypes } from 'sequelize';
import multer from 'multer';
import fs from 'fs';

import Certificate from './model.js';
// import Certificate from './model.js'
// import ListModel from '../list/model.js';
// import TodoListModel from '../todo_list/model.js';
// import UserList from '../user_list/model.js';

class CerificateController{
    static async getCertificate(req, res){
        try {
            // console.timeLog('sa')
            const hasil = await sequelize.query(`SELECT c.*, u.username, u.fullname, u.school, u.email, u.company, u.company_role FROM certificate c join users u on u.id = c.user_id where c."deletedAt" isnull`, { type: QueryTypes.SELECT });

            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            // console.log(error.message);
            res.status(500).json({code:490, pesan:error})
        } 
    }

    static async getCertificateByToken(req, res){
        try {
            // console.timeLog('sa')
            const hasil = await sequelize.query(`SELECT c.*, u.username, u.fullname, u.school, u.email, u.company, u.company_role FROM certificate c join users u on u.id = c.user_id where c.id = '${req.users.id}' and c."deletedAt" isnull`, { type: QueryTypes.SELECT });
            if (!hasil) throw new Error('data not found')
            // const hasil = await sequelize.query(`SELECT * FROM certificate where id=${req.params.id}`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            // console.log(error.message);
            res.status(500).json({code:490, pesan:error.message})
        } 
    }

    static async getCertificateById(req, res){
        try {
            // console.timeLog('sa')
            const hasil = await sequelize.query(`SELECT c.*, u.username, u.fullname, u.school, u.email, u.company, u.company_role FROM certificate c join users u on u.id = c.user_id where c.id = '${req.params.id}' and c."deletedAt" isnull`, { type: QueryTypes.SELECT });
            if (!hasil) throw new Error('data not found')
            // const hasil = await sequelize.query(`SELECT * FROM certificate where id=${req.params.id}`, { type: QueryTypes.SELECT });
            res.status(200).json({status:'OK', data:hasil})
        } catch (error) {
            // console.log(error.message);
            res.status(500).json({code:490, pesan:error.message})
        } 
    }

    static async createCertificate(req, res){
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });

        upload.single('file_pdf')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // console.log(err)
                throw { message: 'Terjadi kesalahan saat mengunggah file PDF.' }
            } else if (err) {
                // console.log(err)
                throw { message: err.message }
            }
            try {
                let {user_id, title} = req.body
                if (!title) throw new Error('title tidak boleh kosong/ harus diisi')
                if (!user_id) throw new Error('user_id tidak boleh kosong/ harus diisi')

                const data_user = await sequelize.query(`select * from users where id = '${user_id}' and "deletedAt" isnull`, {type:QueryTypes.SELECT})
                const cek_user = await sequelize.query(`select * from certificate where user_id = '${user_id}' and "deletedAt" isnull`, {type:QueryTypes.SELECT})

                const filePdf = req.file ? req.file.buffer : null;
                if (!filePdf) throw new Error('Invalid input: No PDF file provided.');
                const filename = `cerificate-` + data_user[0]?.fullname + '-' + Date.now() + '.pdf';
                fs.writeFileSync(`assets/pdf/${filename}`, filePdf);

                title = title + ` | ( ${data_user[0].fullname}/${data_user[0].school} )`

                const hasil = await sequelize.transaction(async (t) => {
                    if (user_id == cek_user[0]?.user_id) throw new Error('Sertifikat untuk user tersebut sudah dibuat!!')
                    let certificate = await Certificate.create(
                        { id: nanoid(), title, user_id, url: `${filename}`},
                        { transaction: t }
                    );
                    return certificate
                });

                res.status(201).json({ pesan: 'Berhasil Membuat Sertifikat!!', data: hasil });
            } catch (error) {
                console.log(error);
                if (error.name == 'SequelizeUniqueConstraintError') {
                    res.status(500).json({ pesan: error.errors[0].message });
                } else if (error.name == 'SequelizeForeignKeyConstraintError') {
                    res.status(500).json({ pesan: error.parent.detail });
                } else if (error.name == 'SequelizeValidationError') {
                    res.status(500).json({ pesan: error });
                } else {
                    res.status(500).json({ pesan: error.message });
                }
            }
        });
    }

    static async updateCertificate(req, res){
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });

        upload.single('file_pdf')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                throw { message: 'Terjadi kesalahan saat mengunggah file PDF.' }
            } else if (err) {
                throw { message: err.message }
            }
            try {
                let {user_id, title} = req.body
                // if (!title) throw new Error('title tidak boleh kosong/ harus diisi')
                // if (!user_id) throw new Error('user_id tidak boleh kosong/ harus diisi')

                const data_user = await sequelize.query(`select * from users where id = '${user_id}'`, {type:QueryTypes.SELECT})
                const cek_user = await sequelize.query(`select * from certificate where user_id = '${user_id}'`, {type:QueryTypes.SELECT})

                const filePdf = req.file ? req.file.buffer : undefined;
                // if (!filePdf) throw new Error('Invalid input: No PDF file provided.');
                let filename = undefined
                
                // console.log(filePdf)
                if (filePdf) {
                    filename = `cerificate-` + data_user[0].fullname + '-' +  Date.now() + '.pdf';
                    fs.writeFileSync(`assets/pdf/${filename}`, filePdf);
                }

                title = title + ` | ( ${data_user[0].fullname}/${data_user[0].school} )`

                let certificate = await Certificate.update(
                    { title, user_id, url: filename},
                    { where: { id: req.params.id }, returning:true },
                );

                // console.log(certificate[0])
                if (!certificate[0] && !certificate[1].length) throw new Error('data not found');

                res.status(201).json({ pesan: 'Berhasil Update Sertifikat!!', data: certificate });
            } catch (error) {
                console.log(error);
                if (error.name == 'SequelizeUniqueConstraintError') {
                    res.status(500).json({ pesan: error.errors[0].message });
                } else if (error.name == 'SequelizeForeignKeyConstraintError') {
                    res.status(500).json({ pesan: error.parent.detail });
                } else if (error.name == 'SequelizeValidationError') {
                    res.status(500).json({ pesan: error });
                } else {
                    res.status(500).json({ pesan: error.message });
                }
            }
        });
    }

    static async deleteCertificate(req, res){
        try {
            const hasil = await Certificate.destroy({ where: { id: req.params.id }, returning: true })
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

export default CerificateController;