// actionsTypes
export const actionsTypes = {
    UPDATE_CATEGORIES_LIST: 'UPDATE_CATEGORIES_LIST',
    UPDATE_TAGS_LIST: 'UPDATE_TAGS_LIST',
};


// actions
export const updateCategoriesList = (data) => ({
    type: actionsTypes.UPDATE_CATEGORIES_LIST,
    data: data
});

export const updateTagsList = (data) => ({
    type: actionsTypes.UPDATE_TAGS_LIST,
    data: data
});
