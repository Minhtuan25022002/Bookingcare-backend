'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AllCode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        //associate để định danh các mối quan hệ
        static associate(models) {
            // define association here
        }
    };
    //không cần khai báo id ở đây vì bên migration đã có id là primaryKey
    AllCode.init({
        key: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'AllCode',
    });
    return AllCode;
};