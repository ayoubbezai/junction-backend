import api from '../utils/api';

class PondServices {
    async getPonds() {
        try {
            const response = await api.get('/ponds');
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error fetching ponds:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch ponds',
                data: null
            };
        }
    }

    async createPond(pondData) {
        try {
            const response = await api.post('/ponds', pondData);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error creating pond:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create pond'
            };
        }
    }

    async getPondById(pondId) {
        try {
            const response = await api.get(`/ponds/${pondId}`);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error fetching pond:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch pond',
                data: null
            };
        }
    }

    async updatePond(pondId, pondData) {
        try {
            const response = await api.put(`/ponds/${pondId}`, pondData);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error updating pond:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update pond'
            };
        }
    }

    async deletePond(pondId) {
        try {
            const response = await api.delete(`/ponds/${pondId}`);
            return {
                success: true,
                message: response.data.message || 'Pond deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting pond:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete pond'
            };
        }
    }
}

export const pondServices = new PondServices();