'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    category: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN
  }, {});
  Post.associate = function (models) {
    // associations can be defined here
    Post.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'postid'
    })
  };
  return Post;
};