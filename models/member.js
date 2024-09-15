'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.hasMany(models.Borrowing, {
        foreignKey: 'memberId',
        as: 'borrowings'
      });
    }
  }

  Member.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    penalized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    penalty_end_date: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null values
      defaultValue: null // Set default to null if no penalty end date is applicable
    }
  }, {
    sequelize,
    modelName: 'Member',
  });

  return Member;
};
