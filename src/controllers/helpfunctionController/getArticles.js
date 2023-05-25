import { db } from '../../module/db.js';
import { BadRequestError } from '../../module/error.js';
import { applySpec, compose, prop } from 'ramda';

const predictHelpUrl = (condition, page, limit) => {
    return condition ? `/api/articles?page=${page}&limit=${limit}` : null;
}

const getQuery = prop('query');
const getLimit = prop('limit');
const getPage = prop('page');

const getLimitInt = compose(parseInt, getLimit, getQuery);

const getPageInt = compose(parseInt, getPage, getQuery);

const getParmsOfPage = applySpec({
    limit: getLimitInt,
    page: getPageInt
});

const getArticles = async (req, res) => {
    const { limit, page } = getParmsOfPage(req);
    const articles = await db.collection('myCollection').find({}).toArray();

    if (!articles) {
        throw new BadRequestError('Something went wrong. Articles are not found');
    }

    if (limit < 1 || page < 1) {
        throw new BadRequestError('Params must to be greater than 1');
    }

    let resultRequest = {
        _links: {
            "next": null,
            "prev": null,
            "self": `/api/articles`,
        },
        page: 1,
        allPages: 1,
        data: [],
    }

    if (page && limit) {
        const allPages = Math.ceil(articles.length / limit);

        resultRequest._links = {
            "next": predictHelpUrl(page < allPages, page + 1, limit),
            "prev": predictHelpUrl(page > 1, page - 1, limit),
            "self": `/api/articles?page=${page}&limit=${limit}`
        };

        resultRequest.page = page;
        resultRequest.allPages = allPages;
        resultRequest.data = articles.slice((page - 1) * limit, page * limit);

    } else {
        resultRequest.data = articles;
    }

    return res.json(resultRequest);
}

export default getArticles;