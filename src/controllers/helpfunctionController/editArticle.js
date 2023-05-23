import { db } from '../../module/db.js';
import { NotFoundError, NotPermissionError } from '../../module/error.js';

const editArticle = async (req, res) => {
    const { id } = req.params;

    const article = await db.collection('myCollection').findOne({ id });

    if (article) {
        const authorId = article.authorId;
        if (authorId == req.user?.uid) {
            const date = Date.now();
            await db.collection('myCollection').updateOne({ id }, {
                $set: { article: req.body?.text, date }
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