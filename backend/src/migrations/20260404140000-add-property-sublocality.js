/**
 * Free-text sublocality for property detail UI only (not used in listing filters).
 */

import { DataTypes } from 'sequelize';

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  await queryInterface.addColumn('properties', 'sublocality', {
    type: DataTypes.STRING(255),
    allowNull: true,
  });
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  await queryInterface.removeColumn('properties', 'sublocality');
}
