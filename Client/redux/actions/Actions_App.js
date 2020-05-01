// actionsTypes
export const actionsTypes = {
    UPDATE_CATEGORIES_LIST: 'UPDATE_CATEGORIES_LIST',
};


// actions
export const updateCategoriesList = (data) => ({
    type: actionsTypes.UPDATE_CATEGORIES_LIST,
    data: data
});
