import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../module/db.js';
import { BadRequestError, NotFoundError, NotPermissionError } from '../module/error.js';

function apiController() {
    //Controlle to add the new article
    async function addArticle(req, res, next) {

        try {
            const { uid } = req.user;

            if (uid) {
                const date = Date.now();
                const id = "" + date + uid;
                const { text } = req.body;
                const query = {
                    id,
                    authorId: uid,
                    article: text,
                    date
                }

                const result = await db.collection('myCollection').insertOne(query);

                if (result.acknowledged) {
                    return res.status(200).send(`An article was inserted with the _id ${id}`);
                }
            }

            throw new BadRequestError('Article was not inserted!');
        } catch (err) {
            next(err);
        }
    }

    //Controlle to edit the article
    async function editArticle(req, res, next) {
        try {
            const { id } = req.params;
            const { uid } = req.user;
            const { text: afterEditText } = req.body;

            const article = await db.collection('myCollection').findOne({ id });
            if (article) {
                const authorId = article.authorId;
                if (authorId == uid) {
                    const date = Date.now();
                    await db.collection('myCollection').updateOne({ id }, {
                        $set: { article: afterEditText, date }
                    });
                } else {
                    throw new NotPermissionError('You don\'t have permission to edit');
                }

                const updateArticle = await db.collection('myCollection').findOne({ id });
                res.status(200).json(updateArticle);
            } else {
                throw new NotFoundError(`The article does not exist`);
            }
        } catch (err) {
            next(err);
        }

    }

    //Controlle to delete the article
    async function deleteArticle(req, res, next) {
        try {
            const { id } = req.params;
            const { uid } = req.user;

            const article = await db.collection('myCollection').findOne({ id });

            if (article) {
                const authorId = article.authorId;
                if (authorId === uid) {
                    const result = await db.collection('myCollection').deleteOne({ id });
                    if (result.deletedCount === 1) {
                        res.status(200).send(`Successfully deleted the ${id} article.`);
                    } else {
                        throw new BadRequestError("Something went wrong. No articles matched the query. Deleted 0 articles.")
                    }
                } else {
                    throw new NotPermissionError('You don\'t have permission to delete');
                }
            } else {
                throw new NotFoundError(`The article does not exist`);
            }
        } catch (err) {
            next(err);
        }
    }

    async function getArticles(req, res, next) {
        try {
            let { limit, page } = req.query;
            limit = parseInt(limit, 10);
            page = parseInt(page, 10);
            const start = (page - 1) * limit;
            const articles = await db.collection('myCollection').find({}).toArray();


            if (!articles) {
                throw new BadRequestError('Something went wrong. Articles are not found');
            }

            let resultRequest = {};
            if (limit && page) {
                const allPages = Math.ceil(articles.length / limit);
                const nextPage = (page < allPages) ? `/api/articles?page=${page + 1}&limit=${limit}` : null;
                const prevPage = (page > 1) ? `/api/articles?page=${page - 1}&limit=${limit}` : null;

                resultRequest = {
                    _links: {
                        "base": "/api/articles",
                        "context": "",
                        "next": nextPage,
                        "prev": prevPage,
                        "self": `/api/articles?page=${page}&limit=${limit}`
                    },
                    page,
                    allPages,
                    data: articles.slice(start, start + limit),
                }

            } else {
                resultRequest = {
                    _links: {
                        "base": "/api/articles",
                        "context": "",
                        "next": null,
                        "prev": null,
                        "self": `/api/articles`
                    },
                    page: 1,
                    allPages: 1,
                    data: articles,
                }
            }

            return res.json(result);
        } catch {
            next(err);
        }
    }

    return {
        addArticle,
        editArticle,
        deleteArticle,
        getArticles
    }
}

export default apiController();