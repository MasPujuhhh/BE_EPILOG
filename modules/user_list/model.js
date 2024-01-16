import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import TodoModel from "../todo/model.js";
import UserModel from "../users/model.js";

// class User extends Model {}
const UserList = sequelize.define('user_list', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        todo_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

UserList.belongsTo(TodoModel, { foreignKey: 'todo_id' });
TodoModel.hasMany(UserList, { foreignKey: 'todo_id' });


UserList.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(UserList, { foreignKey: 'user_id' });

export default UserList