// actionsTypes
export const actionsTypes = {
    ADD_TO_FAVORITES_LIST: 'ADD_TO_FAVORITES_LIST',
};


// actions
export const addToFavoritesList = (data) => ({
    type: actionsTypes.ADD_TO_FAVORITES_LIST,
    data: data
});
