import actionsTypes from '../actions/types/Types_User';

const initialState = {
    hasBusiness: true,
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_HAS_BUSINESS: {
            return {
                ...state,
                hasBusiness: !state.hasBusiness
            }
        }

        default: {
            return state
        }

    }
}

export default UserReducer;