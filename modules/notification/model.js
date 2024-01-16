import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import UserModel from "../users/model.js";

// class User extends Model {}
const Notification = sequelize.define('notification', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
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

Notification.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(Notification, { foreignKey: 'user_id' });

export default Notification