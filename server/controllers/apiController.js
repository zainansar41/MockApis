import Project from "../models/projects.js";
import Api from "../models/api.js";
import _ from 'lodash';
import { match } from 'path-to-regexp';
import Joi from 'joi';

export const createApi = async (req, res) => {
    try {
        const {
            project,
            link,
            requestType,
            response,
            statusCode,
            responseHeaders,
            contentType,
            requestValidation,
            errorResponses,
        } = req.body;

        // Required fields validation
        if (!project) {
            return res.status(400).json({ error: "Project is required" });
        }

        if (!link) {
            return res.status(400).json({ error: "Link is required" });
        }

        if (!requestType) {
            return res.status(400).json({ error: "Request Type is required" });
        }

        // Additional validations (optional but recommended)
        if (statusCode && typeof statusCode !== 'number') {
            return res.status(400).json({ error: "Status code must be a number" });
        }

        if (responseHeaders && typeof responseHeaders !== 'object') {
            return res.status(400).json({ error: "Response headers must be an object" });
        }

        if (contentType && typeof contentType !== 'string') {
            return res.status(400).json({ error: "Content type must be a string" });
        }

        if (requestValidation && typeof requestValidation !== 'object') {
            return res.status(400).json({ error: "Request validation must be an object" });
        }

        if (errorResponses && !Array.isArray(errorResponses)) {
            return res.status(400).json({ error: "Error responses must be an array" });
        }

        // Create a new Api instance with the provided data
        const api = new Api({
            project,
            link,
            requestType,
            response,
            statusCode,
            responseHeaders,
            contentType,
            requestValidation,
            errorResponses,
            // createdAt is automatically set by default
        });

        // Save the Api document to the database
        await api.save();

        // Send a success response
        res.status(201).json(api);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
};


export const getApis = async (req, res) => {
    try {
        const apis = await Api.find({ project: req.params.projectId });
        res.status(200).json(apis);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getMockApiResponse = async (req, res) => {
    try {
        const { projectName } = req.params;
        const fullPath = req.originalUrl;
        const basePath = `/${projectName}`;
        const apiLinkWithQuery = fullPath.substring(basePath.length);
        const [apiLink] = apiLinkWithQuery.split('?');
        const requestType = req.method;

        // Find the project by name
        const project = await Project.findOne({ name: projectName });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Find all Api documents matching the project and requestType
        const apiDocs = await Api.find({
            project: project._id,
            requestType,
        });

        if (!apiDocs || apiDocs.length === 0) {
            return res.status(404).json({ message: 'API endpoint not found.' });
        }

        let matchingApiDoc;
        let errors = [];

        for (const apiDoc of apiDocs) {
            // Match the route using path-to-regexp
            const matcher = match(apiDoc.link, { decode: decodeURIComponent });
            const matched = matcher(apiLink);

            if (!matched) {
                continue;
            }

            // Merge matched params into req.params
            req.params = { ...req.params, ...matched.params };


            // Validate headers
            if (apiDoc.requestValidation && apiDoc.requestValidation.headersSchema) {
                const schema = Joi.object(apiDoc.requestValidation.headersSchema);
                const { error } = schema.validate(req.headers, { allowUnknown: true });

                if (error) {
                    errors.push({
                        statusCode: 400,
                        message: error.message,
                        condition: 'invalidHeaders',
                        apiDoc,
                    });
                    continue;
                }
            }

            // Validate query parameters
            if (apiDoc.requestValidation && apiDoc.requestValidation.querySchema) {
                const schema = Joi.object(apiDoc.requestValidation.querySchema);
                const { error } = schema.validate(req.query);

                if (error) {
                    errors.push({
                        statusCode: 400,
                        message: error.message,
                        condition: 'invalidQuery',
                        apiDoc,
                    });
                    continue;
                }
            }

            // Validate body
            if (apiDoc.requestValidation && apiDoc.requestValidation.bodySchema) {
                const schema = Joi.object(apiDoc.requestValidation.bodySchema);
                const { error } = schema.validate(req.body);

                if (error) {
                    errors.push({
                        statusCode: 400,
                        message: error.message,
                        condition: 'invalidBody',
                        apiDoc,
                    });
                    continue;
                }
            }

            matchingApiDoc = apiDoc;
            break;
        }

        if (!matchingApiDoc) {
            if (errors.length > 0) {
                const errorResponse = errors[0];

                if (errorResponse.apiDoc.errorResponses) {
                    const customError = errorResponse.apiDoc.errorResponses.find(
                        err => err.condition === errorResponse.condition
                    );
                    if (customError) {
                        return res.status(customError.statusCode).json({ message: customError.message });
                    }
                }

                return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
            } else {
                return res.status(404).json({ message: 'No matching API response found for the given request.' });
            }
        }

        res.status(matchingApiDoc.statusCode)
            .set(matchingApiDoc.responseHeaders || {})
            .type(matchingApiDoc.contentType || 'application/json')
            .send(matchingApiDoc.response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}