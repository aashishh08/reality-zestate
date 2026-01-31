import { Lead, Property } from '../../../models/index.js';

class LeadService {
  async createLead(data) {
    const lead = await Lead.create(data);

    const leadWithProperty = await Lead.findByPk(lead.id, {
      include: [{ model: Property }],
    });

    return leadWithProperty;
  }

  async updateLeadStatus(id, status) {
    const lead = await Lead.findByPk(id);

    if (!lead) {
      throw {
        status: 404,
        message: 'Lead not found',
      };
    }

    await lead.update({ status });

    return lead;
  }

  async getLeadById(id) {
    const lead = await Lead.findByPk(id, {
      include: [{ model: Property }],
    });

    if (!lead) {
      throw {
        status: 404,
        message: 'Lead not found',
      };
    }

    return lead;
  }

  async listLeads(filters = {}) {
    const { status, propertyId, source, limit = 10, offset = 0 } = filters;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (source) {
      where.source = source;
    }

    const { count, rows } = await Lead.findAndCountAll({
      where,
      include: [{ model: Property }],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      leads: rows,
    };
  }
}

export default new LeadService();
