module.exports = (sequelize, DataTypes) => {
    var item = sequelize.define('item', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
  
    return item;
};