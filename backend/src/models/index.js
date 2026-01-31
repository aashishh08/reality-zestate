import sequelize from '../database/connection.js';
import PropertyModel from './Property.js';
import PropertySectionModel from './PropertySection.js';
import LocationModel from './Location.js';
import DeveloperModel from './Developer.js';
import CategoryModel from './Category.js';
import PropertyCategoryModel from './PropertyCategory.js';
import BlogModel from './Blog.js';
import LeadModel from './Lead.js';
import UserModel from './User.js';

const Property = PropertyModel(sequelize);
const PropertySection = PropertySectionModel(sequelize);
const Location = LocationModel(sequelize);
const Developer = DeveloperModel(sequelize);
const Category = CategoryModel(sequelize);
const PropertyCategory = PropertyCategoryModel(sequelize);
const Blog = BlogModel(sequelize);
const Lead = LeadModel(sequelize);
const User = UserModel(sequelize);

// Define associations
Property.belongsTo(Developer, { foreignKey: 'developerId' });
Developer.hasMany(Property, { foreignKey: 'developerId' });

Property.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(Property, { foreignKey: 'locationId' });

Property.hasMany(PropertySection, { foreignKey: 'propertyId', onDelete: 'CASCADE' });
PropertySection.belongsTo(Property, { foreignKey: 'propertyId' });

Property.belongsToMany(Category, {
  through: PropertyCategory,
  foreignKey: 'propertyId',
  otherKey: 'categoryId',
});
Category.belongsToMany(Property, {
  through: PropertyCategory,
  foreignKey: 'categoryId',
  otherKey: 'propertyId',
});

Location.belongsTo(Location, { as: 'parent', foreignKey: 'parentId', allowNull: true });
Location.hasMany(Location, { as: 'children', foreignKey: 'parentId' });

Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId', allowNull: true });
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });

Property.hasMany(Lead, { foreignKey: 'propertyId', onDelete: 'SET NULL' });
Lead.belongsTo(Property, { foreignKey: 'propertyId' });

export {
  sequelize,
  Property,
  PropertySection,
  Location,
  Developer,
  Category,
  PropertyCategory,
  Blog,
  Lead,
  User,
};
