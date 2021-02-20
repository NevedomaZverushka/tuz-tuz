import initialState from './state';

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case "SHOW_TOAST": {
      let { toast } = state;
      const { payload } = action;

      toast = { ...toast, ...payload, state: true };

      return { ...state, toast };
    }
    case "HIDE_TOAST": {
      const { toast } = initialState;
      return { ...state, toast };
    }
    case "SET_NOTE": {
      let { note } = state;
      const { payload } = action;

      note = { ...note, ...payload };
      return { ...state, note };
    }
    case "CLEAN_NOTE": {
      const { note } = initialState;
      return { ...state, note };
    }
    case "SET_USER": {
      let { user } = state;
      user = { ...action.payload };
      return { ...state, user };
    }
    case "CLEAR_USER": {
      const { user } = initialState;
      return { ...state, user };
    }

    case "SET_APP_READY": {
      return { ...state, appReady: true };
    }
    case "SET_LOCATION": {
      const { payload } = action;
      return { ...state, userLocation: payload };
    }
    case "CLEAN_LOCATION": {
      const { userLocation } = initialState;
      return { ...state, userLocation };
    }
    case "SET_PLACE": {
      const { payload } = action;
      let { selectedPlace } = state;

      selectedPlace = { ...selectedPlace, ...payload };

      return { ...state, selectedPlace };
    }
    case "CLEAN_PLACE": {
      const { selectedPlace } = initialState;
      return { ...state, selectedPlace };
    }
    case "SET_RECENT_LOCATIONS": {
      const { payload } = action;
      let { recentLocations } = state;

      recentLocations =
          recentLocations.length === 6
              ? [...recentLocations.slice(1), payload]
              : [...recentLocations, payload];

      return { ...state, recentLocations };
    }
    case "SET_DIRECTIONS": {
      const { payload } = action;
      return { ...state, directions: payload };
    }
    case "CLEAN_DIRECTIONS": {
      const { directions } = initialState;
      return { ...state, directions };
    }
    case "SET_BOUNDS": {
      const { payload } = action;
      return { ...state, bounds: payload };
    }
    case "CLEAN_BOUNDS": {
      const { bounds } = initialState;
      return { ...state, bounds };
    }
    case "SET_START_LOCATION": {
      const { payload } = action;
      return { ...state, startLocation: payload };
    }
    case "CLEAN_START_LOCATION": {
      const { startLocation } = initialState;
      return { ...state, startLocation };
    }
    case "SET_END_LOCATION": {
      const { payload } = action;
      return { ...state, endLocation: payload };
    }
    case "CLEAN_END_LOCATION": {
      const { endLocation } = initialState;
      return { ...state, endLocation };
    }
    default: return state;
  }
};
