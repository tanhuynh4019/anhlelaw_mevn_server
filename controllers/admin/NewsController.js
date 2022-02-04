const NewsService = require('../../services/news.service');
module.exports = class NewsController {
    // fetch all news
    static async fetchAllNews(req, res) {
        const news = await NewsService.getAll(req.query.news_status);
        res.status(200).json(news);
    }

    // fetch by ID news
    static async fetchByIDNews(req, res) {
        const news = await NewsService.getByID(req.params.id);
        res.status(200).json(news);
    }

    // Create a news 
    static async createNews(req, res) {
        const isCheck = await NewsService.create(req.body, req.file.filename);
        if (isCheck) {
            res.status(200).json({ message: 'Thêm thành công!' });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }

    // Edit a news 
    static async editNews(req, res) {
        const isCheck = await NewsService.edit(req.body, req.params.id, req.file);
        if (isCheck) {
            res.status(200).json({ message: `Sửa tin tức [${req.body.title}] thành công!` });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }

    // IsActive a news
    static async isActiveNews(req, res) {
        const isCheck = await NewsService.isActive(req.params.id);
        if (isCheck) {
            res.status(200).json({ message: NewsService.GetMessage() });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }

    // IsBin a news
    static async isBinNews(req, res) {
        const isCheck = await NewsService.isBin(req.params.id);
        if (isCheck) {
            res.status(200).json({ message: NewsService.GetMessage() });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }

    // Delete a news
    static async DeleteNews(req, res) {
        const isCheck = await NewsService.delete(req.params.id);
        if (isCheck) {
            res.status(200).json({ message: NewsService.GetMessage() });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }

    // IsComment a news
    static async isCommentNews(req, res) {
        const isCheck = await NewsService.isComment(req.params.id);
        if (isCheck) {
            res.status(200).json({ message: NewsService.GetMessage() });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }

    // Actions news
    static async actionsNews(req, res) {
        const isCheck = await NewsService.actions(req.body.arrID, req.body.actionName);
        if (isCheck) {
            res.status(200).json({ message: NewsService.GetMessage() });
        } else {
            res.status(404).json({ error: NewsService.GetError() });
        }
    }
}