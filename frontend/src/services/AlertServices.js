import api from '../utils/api';

class AlertServices {
  async getAlerts() {
    try {
      console.log('Fetching alerts data...');
      const response = await api.get('/alerts');
      console.log('Alerts API response:', response.data);
      
      // Handle the nested data structure from API
      const alertsData = response.data?.data?.items || response.data?.items || [];
      
      return {
        success: true,
        data: alertsData,
        pagination: {
          current_page: response.data?.data?.current_page || 1,
          total_pages: response.data?.data?.total_pages || 1,
          total_items: response.data?.data?.total_items || 0,
          per_page: response.data?.data?.per_page || 15
        }
      };
    } catch (error) {
      console.error('Error fetching alerts:', error);
      
      return {
        success: false,
        data: [],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: 0,
          per_page: 15
        },
        message: 'Failed to fetch alerts data'
      };
    }
  }

  async getAlertById(id) {
    try {
      const response = await api.get(`/alerts/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching alert:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to fetch alert data'
      };
    }
  }

  async deleteAlert(id) {
    try {
      const response = await api.delete(`/alerts/${id}`);
      return {
        success: true,
        message: 'Alert deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting alert:', error);
      return {
        success: false,
        message: 'Failed to delete alert'
      };
    }
  }
}

export const alertServices = new AlertServices(); 