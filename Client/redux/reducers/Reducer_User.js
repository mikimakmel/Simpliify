import actionsTypes from '../actions/types/Types_User';

const initialState = {
    hasBusiness: false,
    currentUser: null
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_HAS_BUSINESS: {
            return {
                ...state,
                hasBusiness: !state.hasBusiness
            }
        }

        case actionsTypes.UPDATE_CURRENT_USER: {
            return {
                ...state,
                currentUser: action.data
            }
        }

        default: {
            return state
        }

    }
}

export default UserReducer;