// actionsTypes
export const actionsTypes = {
    ADD_TO_FAVORITES_LIST: 'ADD_TO_FAVORITES_LIST',
    REMOVE_FROM_FAVORITES_LIST: 'REMOVE_FROM_FAVORITES_LIST',
    ADD_TO_ORDERS_LIST: 'ADD_TO_ORDERS_LIST',
    REMOVE_FROM_ORDERS_LIST: 'REMOVE_FROM_ORDERS_LIST',
    UPDATE_ORDERS_LIST: 'UPDATE_ORDERS_LIST',
};


// actions
export const addToFavoritesList = (data) => ({
    type: actionsTypes.ADD_TO_FAVORITES_LIST,
    data: data
});

export const removeFromFavoritesList = (data) => ({
    type: actionsTypes.REMOVE_FROM_FAVORITES_LIST,
    data: data
});

export const addToOrdersList = (data) => ({
    type: actionsTypes.ADD_TO_ORDERS_LIST,
    data: data
});

export const removeFromOrdersList = (data) => ({
    type: actionsTypes.REMOVE_FROM_ORDERS_LIST,
    data: data
});

export const updateOrdersList = (data) => ({
    type: actionsTypes.UPDATE_ORDERS_LIST,
    data: data
});
