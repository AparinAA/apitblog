import { db } from '../../module/db.js';
import { BadRequestError } from '../../module/error.js';

const addArticle = async (req, res) => {
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
}

export default addArticle;