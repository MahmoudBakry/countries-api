import ApiError from './ApiError';

// const CapitalizeFirstChar = (name) => name.charAt(0).toUpperCase() + name.slice(1);

export const checkExist = async (id, Model, extraQuery = {}, errorMessage = '') => {
    // to be optimized
    if (typeof extraQuery != 'object') {
        errorMessage = extraQuery;
        extraQuery = {};
    }


    if (validId(id)) {
        let model = await Model.findOne({ _id: id, ...extraQuery }).lean();
        if (model)
            return;
    }

    throw new ApiError(404, errorMessage ? errorMessage : `${Model.modelName} Not Found`);

};


export const checkExistThenGet = async (id, Model, extraQuery = { populate: '' }, errorMessage = '') => {
    let populateQuery = extraQuery.populate || '';

    // to be optimized
    if (typeof extraQuery != 'object') {
        errorMessage = extraQuery;
        extraQuery = {};
    } else {
        delete extraQuery.populate;
    }

    if (validId(id)) {
        let model = await Model.findOne({ _id: id, ...extraQuery }).populate(populateQuery);
        if (model)
            return model;
    }

    throw new ApiError(404, errorMessage ? errorMessage : `${Model.modelName} Not Found`);
};


export const validId = id => isNumeric(id);
export const validIds = ids => isArray(ids) && ids.every(id => validId(id));
export const isNumeric = value => Number.isInteger(parseInt(value));
export const isArray = values => Array.isArray(values);
export const isImgUrl = value => /\.(jpeg|jpg|png)$/.test(value);
export const isLat = value => /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/.test(value);
export const isLng = value => /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/.test(value);
export const isYear = value => /^\d{4}$/.test(value);
export const isInternationNo = value => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value);
