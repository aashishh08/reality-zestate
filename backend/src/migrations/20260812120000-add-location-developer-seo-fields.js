/**
 * CMS SEO fields for location and developer collection pages.
 */

import { DataTypes } from 'sequelize';

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  for (const table of ['locations', 'developers']) {
    await queryInterface.addColumn(table, 'seoTitle', {
      type: DataTypes.STRING(90),
      allowNull: true,
      comment: 'Optional override for <title> / OG title',
    });
    await queryInterface.addColumn(table, 'metaDescription', {
      type: DataTypes.STRING(320),
      allowNull: true,
      comment: 'Meta description for search snippets and OG',
    });
    await queryInterface.addColumn(table, 'heroImageUrl', {
      type: DataTypes.STRING(2048),
      allowNull: true,
      comment: 'Hero / OG image URL for social sharing',
    });
  }
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  for (const table of ['locations', 'developers']) {
    await queryInterface.removeColumn(table, 'heroImageUrl');
    await queryInterface.removeColumn(table, 'metaDescription');
    await queryInterface.removeColumn(table, 'seoTitle');
  }
}
