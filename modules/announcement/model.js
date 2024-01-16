import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";


// class User extends Model {}
const Announcement = sequelize.define('announcement', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        created_by: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        announcement_title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

export default Announcement