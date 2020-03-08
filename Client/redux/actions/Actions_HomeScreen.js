import actionsTypes from '../actions/types/Types_HomeScreen';

export const increaseCounter = () => ({
    type: actionsTypes.INC_COUNTER
});

export const decreaseCounter = () => ({
    type: actionsTypes.DEC_COUNTER
});
