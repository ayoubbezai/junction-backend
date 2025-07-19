import api from '../utils/api';

class SensorServices {
    async getSensorsByPondId(pondId) {
        try {
            const response = await api.get(`/sensors?pond_id=${pondId}`);
            return {
                success: true,
                data: response.data.data.items,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error fetching sensors:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch sensors',
                data: null
            };
        }
    }

    async getSensorReadingsByPondId(pondId, page = 1) {
        try {
            const response = await api.get(`/sensor_reading?pond_id=${pondId}&page=${page}`);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error fetching sensor readings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch sensor readings',
                data: null
            };
        }
    }
}

export const sensorServices = new SensorServices(); 