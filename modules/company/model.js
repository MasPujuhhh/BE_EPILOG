import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

// class User extends Model {}
const Company = sequelize.define('company', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        company_name: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)


export default Company