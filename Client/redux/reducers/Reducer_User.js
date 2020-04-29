import { actionsTypes } from '../actions/Actions_User';

const initialState = {
    view: 'Customer',
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

        case actionsTypes.CHANGE_APP_VIEW: {
            return {
                ...state,
                view: state.view === 'Customer' ? 'Business' : 'Customer'
            }
        }

        default: {
            return state
        }

    }
}

export default UserReducer;