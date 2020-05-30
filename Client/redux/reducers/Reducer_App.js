import { actionsTypes } from '../actions/Actions_App';

const initialState = {
    categoriesList: [],
    tagsList: [],
}

const AppReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_CATEGORIES_LIST: {
            return {
                ...state,
                categoriesList: action.data
            }
        }

        case actionsTypes.UPDATE_TAGS_LIST: {
            return {
                ...state,
                tagsList: action.data
            }
        }

        default: {
            return state
        }

    }
}

export default AppReducer;