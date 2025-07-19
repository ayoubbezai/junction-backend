import api from '../utils/api';

class ReportServices {
  async getReports() {
    try {
      console.log('Fetching reports data...');
      const response = await api.get('/pdfs');
      console.log('Reports API response:', response.data);
      
      // Handle the data structure from API
      const reportsData = response.data?.data || response.data || [];
      
      return {
        success: true,
        data: reportsData
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      
      return {
        success: false,
        data: [],
        message: 'Failed to fetch reports data'
      };
    }
  }

  async downloadReport(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return {
        success: true,
        message: 'Report downloaded successfully'
      };
    } catch (error) {
      console.error('Error downloading report:', error);
      return {
        success: false,
        message: 'Failed to download report'
      };
    }
  }

  async deleteReport(filename) {
    try {
      const response = await api.delete(`/pdfs/${filename}`);
      return {
        success: true,
        message: 'Report deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting report:', error);
      return {
        success: false,
        message: 'Failed to delete report'
      };
    }
  }
}

export const reportServices = new ReportServices(); 