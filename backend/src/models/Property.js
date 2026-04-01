import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      index: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    propertyType: {
      type: DataTypes.ENUM('residential', 'commercial'),
      allowNull: false,
    },
    developerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'developers',
        key: 'id',
      },
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    // ── Enum slug fields (validated at application layer via src/config/enums.js) ──
    citySlug: {
      type: DataTypes.STRING(100),
      allowNull: true, // nullable during transition; tighten after back-fill
      comment: 'Slug of the city enum, e.g. "gurgaon"',
    },
    localitySlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Slug of the locality enum, e.g. "golf-course-road". Must belong to citySlug.',
    },
    developerSlug: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Slug of the developer enum, e.g. "dlf"',
    },
    // ────────────────────────────────────────────────────────────────────────────
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'draft',
    },
    priceMin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    priceMax: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    seoTitle: {
      type: DataTypes.STRING(90),
      allowNull: true,
    },
    h1Heading: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING(158),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'properties',
    timestamps: true,
  });

  return Property;
};
