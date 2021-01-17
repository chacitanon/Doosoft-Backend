module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(255),
        unique: true
      },
      password: {
        type: DataTypes.STRING(255)
      },
      name: {
        type: DataTypes.STRING(255),
        unique: true
      },
      surname: {
        type: DataTypes.STRING(255)
      },
      email: {
        type: DataTypes.STRING(255)
      },
      phone_Number: {
        type: DataTypes.STRING(255)
      },
      address: {
        type: DataTypes.STRING(255)
      }

    },
    {
      tableName: "users",
    }
  );

  return model;
}