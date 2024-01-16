import { DataTypes } from "sequelize";
import sequelize from "../../config/connection.js";

import UserModel from "../users/model.js";
import AnnouncementModel from "../announcement/model.js";

// class User extends Model {}
const Announcement = sequelize.define('announcement_list', {
        // Model attributes are defined here
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        announcement_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }, {
        freezeTableName:true,
        paranoid:true,
      }
)

Announcement.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(Announcement, { foreignKey: 'user_id' });

Announcement.belongsTo(AnnouncementModel, { foreignKey: 'announcemenet_id' });
AnnouncementModel.hasMany(Announcement, { foreignKey: 'announcemenet_id' });

export default Announcement