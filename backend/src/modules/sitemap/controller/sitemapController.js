import sitemapService from '../service/sitemapService.js';

class SitemapController {
  async getSitemapData(req, res) {
    const data = await sitemapService.getSitemapData();
    res.json({ success: true, data });
  }
}

export default new SitemapController();
