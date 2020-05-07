import { actionsTypes } from '../actions/Actions_Business';

const initialState = {
    currentBusiness: {}
}

const BusinessReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_CURRENT_BUSINESS: {
            return {
                ...state,
                currentBusiness: action.data
            }
        }

        default: {
            return state
        }

    }
}

export default BusinessReducer;