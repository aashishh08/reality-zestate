import { Property, PropertySection, sequelize } from '../../../models/index.js';

class IntegrationService {
  async createPropertyFromCRM(data) {
    const transaction = await sequelize.transaction();

    try {
      const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished, sections } = data;

      const property = await Property.create({
        slug,
        title,
        propertyType,
        developerId,
        locationId,
        status: status || 'draft',
        priceMin,
        priceMax,
        isPublished: isPublished || false,
      }, { transaction });

      if (sections && Array.isArray(sections) && sections.length > 0) {
        const propertySecsData = sections.map((section, index) => ({
          propertyId: property.id,
          type: section.type,
          title: section.title,
          order: section.order || index,
          isVisible: section.isVisible !== undefined ? section.isVisible : true,
          data: section.data || {},
        }));

        await PropertySection.bulkCreate(propertySecsData, { transaction });
      }

      await transaction.commit();

      const createdProperty = await Property.findByPk(property.id, {
        include: [PropertySection],
      });

      return createdProperty;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePropertyFromCRM(propertyId, data) {
    const transaction = await sequelize.transaction();

    try {
      const property = await Property.findByPk(propertyId, { transaction });

      if (!property) {
        throw {
          status: 404,
          message: 'Property not found',
        };
      }

      const { slug, title, propertyType, developerId, locationId, status, priceMin, priceMax, isPublished, sections } = data;

      await property.update({
        slug,
        title,
        propertyType,
        developerId,
        locationId,
        status,
        priceMin,
        priceMax,
        isPublished,
      }, { transaction });

      if (sections && Array.isArray(sections)) {
        // Delete existing sections
        await PropertySection.destroy({
          where: { propertyId },
          transaction,
        });

        // Create new sections
        if (sections.length > 0) {
          const propertySecsData = sections.map((section, index) => ({
            propertyId: property.id,
            type: section.type,
            title: section.title,
            order: section.order || index,
            isVisible: section.isVisible !== undefined ? section.isVisible : true,
            data: section.data || {},
          }));

          await PropertySection.bulkCreate(propertySecsData, { transaction });
        }
      }

      await transaction.commit();

      const updatedProperty = await Property.findByPk(propertyId, {
        include: [PropertySection],
      });

      return updatedProperty;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async pushPropertySections(propertyId, sections) {
    const transaction = await sequelize.transaction();

    try {
      const property = await Property.findByPk(propertyId, { transaction });

      if (!property) {
        throw {
          status: 404,
          message: 'Property not found',
        };
      }

      if (!Array.isArray(sections) || sections.length === 0) {
        throw {
          status: 400,
          message: 'Sections must be a non-empty array',
        };
      }

      // Delete existing sections
      await PropertySection.destroy({
        where: { propertyId },
        transaction,
      });

      // Create new sections
      const propertySecsData = sections.map((section, index) => ({
        propertyId,
        type: section.type,
        title: section.title,
        order: section.order || index,
        isVisible: section.isVisible !== undefined ? section.isVisible : true,
        data: section.data || {},
      }));

      await PropertySection.bulkCreate(propertySecsData, { transaction });

      await transaction.commit();

      const updatedProperty = await Property.findByPk(propertyId, {
        include: [PropertySection],
      });

      return updatedProperty;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new IntegrationService();
