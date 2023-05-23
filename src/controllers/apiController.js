import * as dotenv from 'dotenv';
dotenv.config();

import addArticle from './helpfunctionController/addArticle.js';
import editArticle from './helpfunctionController/editArticle.js';
import deleteArticle from './helpfunctionController/deleteArticle.js';
import getArticles from './helpfunctionController/getArticles.js';

function Controller() {
    //Controller to add the new article
    async function addArticleSave(req, res, next) {
        try {
            addArticle(req, res);
        } catch (err) {
            next(err);
        }
    }

    //Controller to edit the article
    async function editArticleSave(req, res, next) {
        try {
            await editArticle(req, res);
        } catch (err) {
            next(err);
        }
    }

    //Controller to delete the article
    async function deleteArticleSave(req, res, next) {
        try {
            await deleteArticle(req, res);
        } catch (err) {
            next(err);
        }
    }

    //Controller to get articles
    async function getArticlesSave(req, res, next) {
        try {
            await getArticles(req, res);
        } catch (err) {
            next(err);
        }
    }

    return {
        addArticleSave,
        editArticleSave,
        deleteArticleSave,
        getArticlesSave
    }
}

export const apiController = Controller();