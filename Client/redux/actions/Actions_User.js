import actionsTypes from './types/Types_User';

export const updateHasBusiness = () => ({
    type: actionsTypes.UPDATE_HAS_BUSINESS
});

export const updateCurrentUser = (data) => ({
    type: actionsTypes.UPDATE_CURRENT_USER,
    data: data
});
