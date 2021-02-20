import axios from 'axios';
import { GOOGLE_API_KEY as key } from '../global/Constants';

export async function searchPlace(input, sessiontoken, location) {
    return new Promise(resolve => {
        axios.get(
            'https://maps.googleapis.com/maps/api/place/autocomplete/json',
            { params: { input, key, sessiontoken, origin: `${location.lat},${location.lng}` }}
        ).then(res => resolve(res)).catch((err) => resolve({ status: 500 }))
    });
}

export async function getPlaceDetail(place_id, sessiontoken) {
    return new Promise(resolve => {
       axios.get(
           'https://maps.googleapis.com/maps/api/place/details/json',
           { params: { key, place_id, sessiontoken, fields: 'formatted_address,geometry,opening_hours,rating,photos,name' } }
       ).then(res => resolve(res)).catch((err) => resolve({ status: 500 }));
    });
}

export async function getPlaceIdByCoordinated(location) {
    return new Promise(resolve => {
        axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            { params: { key, latlng: `${location.latitude},${location.longitude}` } }
        ).then(res => resolve(res)).catch((err) => resolve({ status: 500 }));
    });
}
