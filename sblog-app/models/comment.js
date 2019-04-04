'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    postid: DataTypes.INTEGER
  }, {});
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.Post, {
      as: 'post',
      foreignKey: 'postid'
    })

  };
  return Comment;
};