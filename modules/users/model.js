import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

// class User extends Model {}
const User = sequelize.define('users', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        username: {
          type: DataTypes.STRING,
          allowNull:false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          default:'rapiertech',
          allowNull:false
        },
        role: {
          type: DataTypes.INTEGER,
          allowNull:false,
          
        },
        expired_at: {
            type: DataTypes.DATE,
            // allowNull:true
        },
        image_profile: {
          type: DataTypes.TEXT,
          // allowNull: true,
        },
        fullname: {
          type: DataTypes.STRING,
          // allowNull:true
        },
        address: {
          type: DataTypes.TEXT,
          // allowNull:true
        },
        school: {
          type: DataTypes.STRING,
          // allowNull:true,
        },
        company_role: {
            type: DataTypes.STRING,
            // allowNull:true
        },
        company: {
          type: DataTypes.STRING,
          // allowNull:true
        },
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)


export default User