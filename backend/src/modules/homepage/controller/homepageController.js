import homepageService from '../service/homepageService.js';

class HomepageController {
  async getPublicHomepage(req, res) {
    const data = await homepageService.getPublicHomepage();
    res.json({ success: true, data });
  }
}

export default new HomepageController();
