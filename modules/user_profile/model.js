import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";
import UserModel from "../users/model.js"
import CompanyModel from "../company/model.js"

// class User extends Model {}
const UserProfile = sequelize.define('user_profile', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        image_profile: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fullname: {
          type: DataTypes.STRING,
          allowNull:true
        },
        address: {
          type: DataTypes.TEXT,
          allowNull:true
        },
        school: {
          type: DataTypes.STRING,
          allowNull:true,
        },
        company_role: {
            type: DataTypes.STRING,
            allowNull:true
        }
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

UserProfile.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(UserProfile, { foreignKey: 'user_id' });

UserProfile.belongsTo(CompanyModel, { foreignKey: 'company_id' });
CompanyModel.hasMany(UserProfile, { foreignKey: 'company_id' });

export default UserProfile