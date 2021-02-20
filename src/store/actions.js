const SET_ACTIONS = {
  toast: 'SHOW_TOAST',
  note: 'SET_NOTE',
  user: 'SET_USER',

  location: 'SET_LOCATION',
  place: 'SET_PLACE',
  history: 'SET_RECENT_LOCATIONS',
  app: 'SET_APP_READY',
  directions: 'SET_DIRECTIONS',
  bounds: 'SET_BOUNDS'
};
const CLEAN_ACTIONS = {
  toast: 'HIDE_TOAST',
  note: 'CLEAN_NOTE',
  user: 'CLEAR_USER',

  location: 'CLEAN_LOCATION',
  place: 'CLEAN_PLACE',
  directions: 'CLEAN_DIRECTIONS',
  bounds: 'CLEAN_BOUNDS'
};

export const setAction = (type, payload) => {
  return { type: SET_ACTIONS[type], payload };
};
export const cleanAction = (type) => {
  return { type: CLEAN_ACTIONS[type] };
};
