import axios from 'axios';

export const getRushingData = async () => {
    return await axios('rushing.json');
}