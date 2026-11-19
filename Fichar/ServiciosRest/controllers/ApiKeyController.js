/**
 * The ApiKeyController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ApiKeyService');
const addApiKey = async (request, response) => {
  await Controller.handleRequest(request, response, service.addApiKey);
};

const deleteApiKey = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteApiKey);
};

const getApiKeyById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getApiKeyById);
};

const getApiKeys = async (request, response) => {
  await Controller.handleRequest(request, response, service.getApiKeys);
};

const updateApiKey = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateApiKey);
};


module.exports = {
  addApiKey,
  deleteApiKey,
  getApiKeyById,
  getApiKeys,
  updateApiKey,
};
