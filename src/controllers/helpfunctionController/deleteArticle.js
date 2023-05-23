import { db } from '../../module/db.js';
import { BadRequestError, NotFoundError, NotPermissionError } from '../../module/error.js';

const deleteArticle = async (req, res) => {
    const { id } = req.params;
    const { uid } = req.user;

    const article = await db.collection('myCollection').findOne({ id });

    if (article) {
        const authorId = article.authorId;
        if (authorId === uid) {
            const result = await db.collection('myCollection').deleteOne({ id });

            if (result.deletedCount === 1) {
                return res.status(200).send(`Successfully deleted the ${id} article.`);
            } else {
                throw new BadRequestError("Something went wrong. No articles matched the query. Deleted 0 articles.")
            }
        } else {
            throw new NotPermissionError('You don\'t have permission to delete');
        }
    } else {
        throw new NotFoundError(`The article does not exist`);
    }
}

export default deleteArticle;