import api from '../utils/api';

class TipsServices {
    async getTips() {
        try {
            const response = await api.get('/tips');
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error fetching tips:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tips',
                data: null
            };
        }
    }

    async deleteTip(tipId) {
        try {
            const response = await api.delete(`/tips/${tipId}`);
            return {
                success: true,
                message: response.data.message || 'Tip deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting tip:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete tip'
            };
        }
    }

    async createTip(tipData) {
        try {
            const response = await api.post('/tips', tipData);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error creating tip:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create tip'
            };
        }
    }
}

export const tipsServices = new TipsServices(); 