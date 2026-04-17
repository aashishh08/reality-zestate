/**
 * Flag leads that requested a floor plan / layout download from the property page.
 */

import { DataTypes } from 'sequelize';

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface) {
  await queryInterface.addColumn('leads', 'layoutDownload', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

/** @param {import('sequelize').QueryInterface} queryInterface */
export async function down(queryInterface) {
  await queryInterface.removeColumn('leads', 'layoutDownload');
}
