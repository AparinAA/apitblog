import * as dotenv from 'dotenv';
dotenv.config();

import { tryCatch } from 'ramda';

import addArticle from './helpfunctionController/addArticle.js';
import editArticle from './helpfunctionController/editArticle.js';
import deleteArticle from './helpfunctionController/deleteArticle.js';

const createSaveFunction = (fn, errorClass) => tryCatch(fn, errorClass);

function Controller() {
    //Controller to add the new article
    async function addArticleSave(req, res, next) {
        return createSaveFunction(addArticle, next);
    }

    //Controller to edit the article
    async function editArticleSave(req, res, next) {
        return createSaveFunction(editArticle, next);
    }

    //Controller to delete the article
    async function deleteArticleSave(req, res, next) {
        return createSaveFunction(deleteArticle, next);
    }

    //Controller to get articles
    async function getArticlesSave(req, res, next) {
        return createSaveFunction(getArticles, next);
    }

    return {
        addArticleSave,
        editArticleSave,
        deleteArticleSave,
        getArticlesSave
    }
}

export const apiController = Controller();