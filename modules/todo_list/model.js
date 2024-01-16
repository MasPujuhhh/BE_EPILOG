import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import TodoModel from "../todo/model.js";
import ListModel from "../list/model.js";

// class User extends Model {}
const TodoList = sequelize.define('todo_list', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        todo_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        list_id: {
          type: DataTypes.STRING,
          default:false,
          allowNull: false,
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

TodoList.belongsTo(TodoModel, { foreignKey: 'todo_id' });
TodoModel.hasMany(TodoList, { foreignKey: 'todo_id' });


TodoList.belongsTo(ListModel, { foreignKey: 'list_id' });
ListModel.hasMany(TodoList, { foreignKey: 'list_id' });

export default TodoList