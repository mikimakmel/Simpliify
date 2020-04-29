// actionsTypes
export const actionsTypes = {
    UPDATE_CURRENT_BUSINESS: 'UPDATE_CURRENT_BUSINESS',
};


// actions
export const updateCurrentBusiness = (data) => ({
    type: actionsTypes.UPDATE_CURRENT_BUSINESS,
    data: data
});
