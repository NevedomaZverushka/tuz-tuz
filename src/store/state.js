const initialState = {
  appReady: false,
  userLocation: {
    lat: null,
    lng: null
  },
  selectedPlace: {
    name: null,
    placeId: null,
    address: null,
    location: {
      lat: null,
      lng: null
    },
    photo: null,
    distance: null,
    isFavorite: false,
    isFullData: false
  },
  recentLocations: [],
  directions: [],
  bounds: [],

  toast: {
    state: false,
    type: "",
    text: "",
  },
  note: {
    id: null,
    title: "",
    note: "",
    created_at: null,
  },
  user: null,
};

export default initialState;
