// actionsTypes
export const actionsTypes = {
    UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
    UPDATE_USER_LOCATION: 'UPDATE_USER_LOCATION',
    UPDATE_MY_BUSINESS: 'UPDATE_MY_BUSINESS',
    CHANGE_APP_VIEW: 'CHANGE_APP_VIEW',
};


// actions
export const updateCurrentUser = (data) => ({
    type: actionsTypes.UPDATE_CURRENT_USER,
    data: data
});

export const updateUserLocation = (data) => ({
    type: actionsTypes.UPDATE_USER_LOCATION,
    data: data
});

export const updateMyBusiness = (data) => ({
    type: actionsTypes.UPDATE_MY_BUSINESS,
    data: data
});

export const changeAppView = () => ({
    type: actionsTypes.CHANGE_APP_VIEW
});
