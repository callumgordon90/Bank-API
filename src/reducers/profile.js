import { UPDATE_PROFILE } from '../utils/constants';



//The fact that I have added profileReducer to store allows me to access the profile information from the store
// in any component from store.profile using the mapStateToProps function
const profileReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_PROFILE:
            return { ...action.profile };
        default:
            return state;
    }
};

export default profileReducer;