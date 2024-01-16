import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import UserModel from "../users/model.js";
import ScheduleModel from "../schedule/model.js";
import TodoModel from "../todo/model.js";

// class User extends Model {}
const Logbook = sequelize.define('logbook', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        schedule_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        todo_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT
        },
        keterangan: {
          type: DataTypes.INTEGER
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

Logbook.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(Logbook, { foreignKey: 'user_id' });

Logbook.belongsTo(ScheduleModel, { foreignKey: 'schedule_id' });
ScheduleModel.hasMany(Logbook, { foreignKey: 'schedule_id' });

Logbook.belongsTo(TodoModel, { foreignKey: 'todo_id' });
TodoModel.hasMany(Logbook, { foreignKey: 'todo_id' });

export default Logbook