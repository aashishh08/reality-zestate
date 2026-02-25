import sequelize from '../database/connection.js';
import PropertyModel from './Property.js';
import PropertySectionModel from './PropertySection.js';
import LocationModel from './Location.js';
import DeveloperModel from './Developer.js';
import CategoryModel from './Category.js';
import PropertyCategoryModel from './PropertyCategory.js';
import TagModel from './Tag.js';
import PropertyTagModel from './PropertyTag.js';
import BlogModel from './Blog.js';
import LeadModel from './Lead.js';
import UserModel from './User.js';

const Property = PropertyModel(sequelize);
const PropertySection = PropertySectionModel(sequelize);
const Location = LocationModel(sequelize);
const Developer = DeveloperModel(sequelize);
const Category = CategoryModel(sequelize);
const PropertyCategory = PropertyCategoryModel(sequelize);
const Tag = TagModel(sequelize);
const PropertyTag = PropertyTagModel(sequelize);
const Blog = BlogModel(sequelize);
const Lead = LeadModel(sequelize);
const User = UserModel(sequelize);

// ─── Property associations ────────────────────────────────────────────────────
Property.belongsTo(Developer, { foreignKey: 'developerId' });
Developer.hasMany(Property, { foreignKey: 'developerId' });

Property.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(Property, { foreignKey: 'locationId' });

Property.hasMany(PropertySection, { foreignKey: 'propertyId', onDelete: 'CASCADE' });
PropertySection.belongsTo(Property, { foreignKey: 'propertyId' });

Property.hasMany(Lead, { foreignKey: 'propertyId', onDelete: 'SET NULL' });
Lead.belongsTo(Property, { foreignKey: 'propertyId' });

// ─── Category (many-to-many) ──────────────────────────────────────────────────
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

// ─── Tag (many-to-many) ────────────────────────────────────────────────────────
// A property can have multiple tags (upcoming, trending, featured …)
// A tag can be applied to multiple properties.
Property.belongsToMany(Tag, {
  through: PropertyTag,
  foreignKey: 'propertyId',
  otherKey: 'tagId',
  as: 'Tags',
});
Tag.belongsToMany(Property, {
  through: PropertyTag,
  foreignKey: 'tagId',
  otherKey: 'propertyId',
  as: 'Properties',
});

// ─── Hierarchical self-joins ──────────────────────────────────────────────────
Location.belongsTo(Location, { as: 'parent', foreignKey: 'parentId', allowNull: true });
Location.hasMany(Location, { as: 'children', foreignKey: 'parentId' });

Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId', allowNull: true });
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });

export {
  sequelize,
  Property,
  PropertySection,
  Location,
  Developer,
  Category,
  PropertyCategory,
  Tag,
  PropertyTag,
  Blog,
  Lead,
  User,
};
