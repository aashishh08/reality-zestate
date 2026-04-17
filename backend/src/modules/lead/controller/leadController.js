import leadService from '../service/leadService.js';

class LeadController {
  async createLead(req, res) {
    const { name, email, phone, source, propertyId, layoutDownload } = req.body;

    if (!name || !email || !phone) {
      throw {
        status: 400,
        message: 'Missing required fields: name, email, phone',
      };
    }

    const lead = await leadService.createLead({
      name,
      email,
      phone,
      source: source || 'website',
      propertyId: propertyId || null,
      status: 'new',
      layoutDownload: Boolean(layoutDownload),
    });

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully',
    });
  }

  async updateLeadStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw {
        status: 400,
        message: 'Status is required',
      };
    }

    const validStatuses = ['new', 'contacted', 'qualified', 'interested', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      throw {
        status: 400,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    const lead = await leadService.updateLeadStatus(id, status);

    res.json({
      success: true,
      data: lead,
      message: 'Lead status updated successfully',
    });
  }

  async getLeadById(req, res) {
    const { id } = req.params;

    const lead = await leadService.getLeadById(id);

    res.json({
      success: true,
      data: lead,
    });
  }

  async listLeads(req, res) {
    const { status, propertyId, source, limit = 10, offset = 0 } = req.query;

    const result = await leadService.listLeads({
      status,
      propertyId,
      source,
      limit,
      offset,
    });

    res.json({
      success: true,
      data: result.leads,
      pagination: {
        total: result.total,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      },
    });
  }
}

export default new LeadController();
