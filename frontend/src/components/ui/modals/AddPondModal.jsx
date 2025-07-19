import React, { useState, useEffect } from 'react';
import { X, Plus, Save, AlertCircle } from 'lucide-react';
import { pondServices } from '../../../services/PondServices';

const AddPondModal = ({ isOpen, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [regions, setRegions] = useState([]);

    const [formData, setFormData] = useState({
        region_id: '',
        location: '',
        size: '',
        pond_name: '',
        safe_range: {
            ph: { min: 7, max: 12, unit: 'pH' },
            temperature: { min: 20, max: 30, unit: 'C' },
            oxygen: { min: 5, max: 10, unit: 'mg/L' }
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchRegions();
        }
    }, [isOpen]);

    const fetchRegions = async () => {
        try {
            // This would need to be implemented based on your regions API
            // For now, we'll use mock data
            setRegions([
                { id: 1, name: 'North Zone' },
                { id: 2, name: 'South Zone' },
                { id: 3, name: 'East Zone' },
                { id: 4, name: 'West Zone' }
            ]);
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSafeRangeChange = (parameter, field, value) => {
        setFormData(prev => ({
            ...prev,
            safe_range: {
                ...prev.safe_range,
                [parameter]: {
                    ...prev.safe_range[parameter],
                    [field]: parseFloat(value) || 0
                }
            }
        }));
    };

    const validateForm = () => {
        if (!formData.region_id) return 'Please select a region';
        if (!formData.location.trim()) return 'Please enter a location';
        if (!formData.size) return 'Please select a size';
        if (!formData.pond_name.trim()) return 'Please enter a pond name';

        // Validate safe ranges
        const { safe_range } = formData;
        if (safe_range.ph.min >= safe_range.ph.max) return 'pH minimum must be less than maximum';
        if (safe_range.temperature.min >= safe_range.temperature.max) return 'Temperature minimum must be less than maximum';
        if (safe_range.oxygen.min >= safe_range.oxygen.max) return 'Oxygen minimum must be less than maximum';

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        try {
            const response = await pondServices.createPond(formData);
            if (response.success) {
                onSuccess(response.data);
                onClose();
                // Reset form
                setFormData({
                    region_id: '',
                    location: '',
                    size: '',
                    pond_name: '',
                    safe_range: {
                        ph: { min: 7, max: 12, unit: 'pH' },
                        temperature: { min: 20, max: 30, unit: 'C' },
                        oxygen: { min: 5, max: 10, unit: 'mg/L' }
                    }
                });
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('Failed to create pond. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Pond</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region *
                                </label>
                                <select
                                    value={formData.region_id}
                                    onChange={(e) => handleInputChange('region_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(region => (
                                        <option key={region.id} value={region.id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size *
                                </label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => handleInputChange('size', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Size</option>
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                    <option value="Extra Large">Extra Large</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pond Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.pond_name}
                                    onChange={(e) => handleInputChange('pond_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter pond name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter location"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Safe Ranges */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Safe Ranges</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* pH Range */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">pH Range</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.safe_range.ph.min}
                                            onChange={(e) => handleSafeRangeChange('ph', 'min', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.safe_range.ph.max}
                                            onChange={(e) => handleSafeRangeChange('ph', 'max', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">Unit: {formData.safe_range.ph.unit}</div>
                                </div>
                            </div>

                            {/* Temperature Range */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Temperature Range</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.safe_range.temperature.min}
                                            onChange={(e) => handleSafeRangeChange('temperature', 'min', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.safe_range.temperature.max}
                                            onChange={(e) => handleSafeRangeChange('temperature', 'max', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">Unit: {formData.safe_range.temperature.unit}</div>
                                </div>
                            </div>

                            {/* Oxygen Range */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Oxygen Range</h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.safe_range.oxygen.min}
                                            onChange={(e) => handleSafeRangeChange('oxygen', 'min', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.safe_range.oxygen.max}
                                            onChange={(e) => handleSafeRangeChange('oxygen', 'max', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">Unit: {formData.safe_range.oxygen.unit}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{isLoading ? 'Creating...' : 'Create Pond'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPondModal; 