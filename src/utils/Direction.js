import axios from 'axios';
import { GOOGLE_API_KEY as key } from '../global/Constants';

export async function getDirection(start, end) {
    return new Promise(resolve => {
        axios.get(
            'https://maps.googleapis.com/maps/api/directions/json',
            { params: { key, origin: `${start.lat},${start.lng}`, destination: `${end.lat},${end.lng}`, mode: "walking" }}
        ).then(res => resolve(res)).catch((err) => resolve({ status: 500 }))
    });
}
