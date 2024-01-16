import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import UserModel from "../users/model.js";
import LogbookModel from "../logbook/model.js";

// class User extends Model {}
const Comment = sequelize.define('comment', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        logbook_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

Comment.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(Comment, { foreignKey: 'user_id' });

Comment.belongsTo(LogbookModel, { foreignKey: 'logbook_id' });
LogbookModel.hasMany(Comment, { foreignKey: 'logbook_id' });

export default Comment