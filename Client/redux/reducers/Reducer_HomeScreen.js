import actionsTypes from '../actions/types/Types_HomeScreen';

const initialState = {
    counter: 3
}

const HomeScreenReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.INC_COUNTER: {
            return {
                ...state,
                counter: state.counter + 1
            }
        }

        case actionsTypes.DEC_COUNTER: {
            return {
                ...state,
                counter: state.counter - 1
            }
        }

        default: {
            return state
        }

    }
}

export default HomeScreenReducer;