import { db } from '../../module/db.js';
import { BadRequestError } from '../../module/error.js';
import { applySpec } from 'ramda';
import { getUserUID, getTextFromBody } from './queryFunctions.js';

const querySp = applySpec({
    id: compose(x => Date.now() + x, getUserUID),
    authorId: getUserUID,
    article: getTextFromBody,
    date: () => Date.now(),
})

const addArticle = async (req, res) => {
    const uid = getUserUID(req);
    if (uid) {
        const query = querySp(req);
        const result = await db.collection('myCollection').insertOne(query);

        if (result.acknowledged) {
            return res.status(200).send(`An article was inserted with the _id ${query.id}`);
        }
    }

    throw new BadRequestError('Article was not inserted!');
}

export default addArticle;