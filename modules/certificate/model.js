import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import UserModel from "../users/model.js";

// class Certificate extends Model {}
const Certificate = sequelize.define('certificate', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

Certificate.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(Certificate, { foreignKey: 'user_id' });

export default Certificate