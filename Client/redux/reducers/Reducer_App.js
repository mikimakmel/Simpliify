import { actionsTypes } from '../actions/Actions_App';

const initialState = {
    categoriesList: [],
}

const AppReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_CATEGORIES_LIST: {
            return {
                ...state,
                categoriesList: action.data
            }
        }

        default: {
            return state
        }

    }
}

export default AppReducer;