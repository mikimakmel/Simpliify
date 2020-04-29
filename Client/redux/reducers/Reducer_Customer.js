import { actionsTypes } from '../actions/Actions_Customer';

const initialState = {
    favoritesList: []
}

const CustomerReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.ADD_TO_FAVORITES_LIST: {
            return {
                ...state,
                favoritesList: [...state.favoritesList, action.data]
            }
        }

        default: {
            return state
        }

    }
}

export default CustomerReducer;