import { prop, compose } from 'ramda';

//Get id from params of url
const getParams = prop('params');
const getId = prop('id');
export const getIdFromParams = compose(getId, getParams); //main

//Get text from body of url
const getBody = prop('body');
const getText = prop('text');
export const getTextFromBody = compose(getText, getBody); //main

//get auth user id
const getUser = prop('user');
const getUID = prop('uid');
export const getUserUID = compose(getUID, getUser); //main

// get ID author
export const getIdAuthor = compose(prop('authorId')); //main

// get params from query
const getQuery = prop('query');
const getLimit = prop('limit');
const getPage = prop('page');

//Limit element on the page
export const getLimitInt = compose(parseInt, getLimit, getQuery);
//Number page
export const getPageInt = compose(parseInt, getPage, getQuery);
