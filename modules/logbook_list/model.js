import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import TodoModel from "../todo/model.js";
import LogbookModel from "../logbook/model.js";

// class User extends Model {}
const LogbookList = sequelize.define('logbook_list', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        todo_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        logbook_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

LogbookList.belongsTo(TodoModel, { foreignKey: 'todo_id' });
TodoModel.hasMany(LogbookList, { foreignKey: 'todo_id' });

LogbookList.belongsTo(LogbookModel, { foreignKey: 'logbook_id' });
LogbookModel.hasMany(LogbookList, { foreignKey: 'logbook_id' });

export default LogbookList