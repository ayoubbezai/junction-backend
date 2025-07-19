import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell, AlertTriangle, AlertCircle, Info, Calendar, Eye, Trash2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { alertServices } from '../services/AlertServices';

// Alert Level Badge Component
const AlertLevelBadge = ({ level }) => {
    const colorMap = {
        'critical': 'bg-red-100 text-red-700 border-red-200',
        'warning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'info': 'bg-blue-100 text-blue-700 border-blue-200',
        'success': 'bg-green-100 text-green-700 border-green-200'
    };

    const iconMap = {
        'critical': <AlertTriangle className="w-3 h-3" />,
        'warning': <AlertCircle className="w-3 h-3" />,
        'info': <Info className="w-3 h-3" />,
        'success': <Bell className="w-3 h-3" />
    };

    const color = colorMap[level?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
    const icon = iconMap[level?.toLowerCase()] || <Bell className="w-3 h-3" />;

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
            {icon}
            <span className="ml-1 capitalize">{level}</span>
        </span>
    );
};

// Time Display Component
const TimeDisplay = ({ createdAt }) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    let timeText;
    if (diffInMinutes < 1) {
        timeText = 'Just now';
    } else if (diffInMinutes < 60) {
        timeText = `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
        timeText = `${diffInHours}h ago`;
    } else {
        timeText = date.toLocaleDateString();
    }

    return (
        <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {timeText}
        </div>
    );
};

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedLevel, setSelectedLevel }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Level Filter */}
            <div className="relative">
                <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                    <option value="">All Levels</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
        </div>
    </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-lg text-sm ${page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// Alerts Table Component
const AlertsTable = ({ alerts, isLoading, onView, onDelete }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading alerts...</p>
                </div>
            </div>
        );
    }

    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
                    <p className="text-gray-600">All systems are running smoothly</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Alert Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Pond ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {alerts.map((alert) => (
                            <tr key={alert.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                <Bell className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                                                <p className="text-xs text-gray-500">ID: {alert.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <AlertLevelBadge level={alert.level} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-xs font-medium text-blue-600">{alert.pond_id}</span>
                                        </div>
                                        <span className="text-sm text-gray-700">Pond {alert.pond_id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <TimeDisplay createdAt={alert.created_at} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onView(alert)}
                                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(alert)}
                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            title="Delete Alert"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchAlerts();
    }, [currentPage]);

    const fetchAlerts = async () => {
        setIsLoading(true);
        try {
            const response = await alertServices.getAlerts();
            if (response.success) {
                setAlerts(response.data || []);
                setTotalPages(response.pagination.total_pages || 1);
                setTotalItems(response.pagination.total_items || 0);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter alerts based on search and filters
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = !selectedLevel || alert.level.toLowerCase() === selectedLevel.toLowerCase();

        return matchesSearch && matchesLevel;
    });

    const handleView = (alert) => {
        console.log('View alert:', alert);
        // Implement view functionality
    };

    const handleDelete = async (alert) => {
        if (window.confirm('Are you sure you want to delete this alert?')) {
            const response = await alertServices.deleteAlert(alert.id);
            if (response.success) {
                fetchAlerts(); // Refresh the list
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen px-12 bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Alerts Management</h1>
                        <p className="text-sm text-gray-600">
                            Monitor and manage system alerts ({totalItems} total alerts)
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                />

                {/* Alerts Table */}
                <div className="mb-6">
                    <AlertsTable
                        alerts={filteredAlerts}
                        isLoading={isLoading}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Pagination */}
                {!isLoading && filteredAlerts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Alerts; 