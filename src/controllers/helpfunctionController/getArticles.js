import { db } from '../../module/db.js';
import { BadRequestError } from '../../module/error.js';
import { applySpec, compose, prop } from 'ramda';

const predictHelpUrl = (condition, page, limit) => {
    return condition ? `/api/articles?page=${page}&limit=${limit}` : null;
}

const getLimit = prop('limit');
const getPage = prop('page');

const getLimitInt = compose(
    parseInt,
    getLimit
);

const getPageInt = compose(
    parseInt,
    getPage
);

const getParmsOfPage = applySpec({
    limit: getLimitInt,
    page: getPageInt
});


const getArticles = async (req, res) => {
    const { limit, page } = getParmsOfPage(req.query);
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
        const allPages = Math.ceil(articles.length / limit);

        resultRequest = {
            _links: {
                "next": predictHelpUrl(page < allPages, page + 1, limit),
                "prev": predictHelpUrl(page > 1, page - 1, limit),
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