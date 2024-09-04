module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(),
    },
    accesstoken: {
      type: DataTypes.STRING(),
      nullable: true,
    },
  });
};
