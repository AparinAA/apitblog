import { db } from '../../module/db.js';
import { BadRequestError } from '../../module/error.js';

const getArticles = async (req, res) => {
    let { limit, page } = req.query;
    const articles = await db.collection('myCollection').find({}).toArray();

    if (!articles) {
        throw new BadRequestError('Something went wrong. Articles are not found');
    }

    let resultRequest = {
        _links: {
            "base": "/api/articles",
            "context": "",
            "next": null,
            "prev": null,
            "self": `/api/articles`
        },
        page: 1,
        allPages: 1,
    };

    if (limit && page) {
        function predict(condition, page, limit) {
            return condition ? `/api/articles?page=${page}&limit=${limit}` : null;
        }

        limit = parseInt(limit, 10);
        page = parseInt(page, 10);
        const allPages = Math.ceil(articles.length / limit);

        resultRequest = {
            _links: {
                "next": predict(page < allPages, page + 1, limit),
                "prev": predict(page > 1, page - 1, limit),
                "self": `/api/articles?page=${page}&limit=${limit}`
            },
            page,
            allPages,
            data: articles.slice((page - 1) * limit, start + limit),
        }
    } else {
        resultRequest = { data: articles }
    }

    return res.json(resultRequest);
}

export default getArticles;