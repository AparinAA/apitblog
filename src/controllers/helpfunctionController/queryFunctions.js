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