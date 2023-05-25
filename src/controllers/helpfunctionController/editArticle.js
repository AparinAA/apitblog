import { compose, prop } from 'ramda';
import { db } from '../../module/db.js';
import { NotFoundError, NotPermissionError } from '../../module/error.js';
import { getUserUID, getTextFromBody, getIdFromParams, getIdAuthor } from './queryFunctions.js';

const editArticle = async (req, res) => {
    const id = getIdFromParams(req);

    const article = await db.collection('myCollection').findOne({ id });

    if (article) {
        if (getIdAuthor(article) === getUserUID(req)) {
            const date = Date.now();
            await db.collection('myCollection').updateOne({ id }, {
                $set: { article: getTextFromBody(req), date }
            });
        } else {
            throw new NotPermissionError('You don\'t have permission to edit');
        }

        const updateArticle = await db.collection('myCollection').findOne({ id });
        return res.status(200).json(updateArticle);
    } else {
        throw new NotFoundError(`The article does not exist`);
    }
}

export default editArticle;