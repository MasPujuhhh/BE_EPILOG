// import { Op } from "sequelize";
// import { nanoid } from 'nanoid';
// import sequelize from '../config/connection.js'


// import scheduleModel from "../modules/schedule/model.js";


// class OpenSchedule{
//     static async openForToday(req, res, next){
//         try {
//             const today = new Date().toISOString().slice(0, 10);
//             const existingRecord = await scheduleModel.findOne({
//                 where: sequelize.where(
//                     sequelize.fn('DATE', sequelize.col('date')),
//                     today
//                 ),
//             });
//             if (!existingRecord) {
//                 await scheduleModel.create({id:nanoid(), date: today });
//                 // console.log(`Inserted date ${today} into the database.`);
//             }
//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }
// }

// export default OpenSchedule;