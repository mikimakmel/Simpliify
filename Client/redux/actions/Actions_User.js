// actionsTypes
export const actionsTypes = {
    UPDATE_HAS_BUSINESS: 'UPDATE_HAS_BUSINESS',
    UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
    CHANGE_APP_VIEW: 'CHANGE_APP_VIEW',
};


// actions
export const updateHasBusiness = () => ({
    type: actionsTypes.UPDATE_HAS_BUSINESS
});

export const updateCurrentUser = (data) => ({
    type: actionsTypes.UPDATE_CURRENT_USER,
    data: data
});

export const changeAppView = () => ({
    type: actionsTypes.CHANGE_APP_VIEW
});
