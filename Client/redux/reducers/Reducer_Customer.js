import { actionsTypes } from '../actions/Actions_Customer';

const initialState = {
    favoritesList: [],
    ordersList: [],
}

const CustomerReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.ADD_TO_FAVORITES_LIST: {
            return {
                ...state,
                favoritesList: [...state.favoritesList, action.data]
            }
        }

        case actionsTypes.REMOVE_FROM_FAVORITES_LIST: {
            return {
                ...state,
                favoritesList: state.favoritesList.filter(item => {
                    if(action.data !== item.businessDetails.business.businessid) {
                        return item;
                    }
                })
            }
        }

        case actionsTypes.ADD_TO_ORDERS_LIST: {
            return {
                ...state,
                ordersList: [...state.ordersList, action.data]
            }
        }

        case actionsTypes.UPDATE_ORDERS_LIST: {
            return {
                ...state,
                ordersList: action.data
            }
        }

        default: {
            return state
        }

    }
}

export default CustomerReducer;