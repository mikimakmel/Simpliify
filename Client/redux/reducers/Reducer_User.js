import { actionsTypes } from '../actions/Actions_User';

const initialState = {
    view: 'Customer',
    currentUser: null,
    myBusiness: null,
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_CURRENT_USER: {
            return {
                ...state,
                currentUser: action.data
            }
        }

        case actionsTypes.UPDATE_MY_BUSINESS: {
            return {
                ...state,
                myBusiness: action.data
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