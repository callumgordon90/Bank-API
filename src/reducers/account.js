import { SET_ACCOUNT, UPDATE_ACCOUNT, RESET_ACCOUNT } from '../utils/constants';

//This reducer alters the states of the account on the front end as the user makes financial transactions

const accountReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_ACCOUNT:
            return {
                ...action.accountDetails.account
            };
        case UPDATE_ACCOUNT:
            if (action.operation === 'withdraw') {
                return {
                    ...state,
                    total_balance: +state.total_balance - +action.amountToChange
                };
            } else if (action.operation === 'deposit') {
                return {
                    ...state,
                    total_balance: +state.total_balance + +action.amountToChange
                };
            }
            break;
        case RESET_ACCOUNT:
            return {};
        default:
            return state;
    }
};

export default accountReducer;