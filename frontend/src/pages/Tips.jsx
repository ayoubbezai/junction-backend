import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Eye, Calendar, MessageSquare, Plus, Lightbulb } from 'lucide-react';
import { tipsServices } from '../services/TipsServices';

// Time Display Component
const TimeDisplay = ({ timestamp }) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    let timeText;
    if (diffInHours < 1) {
        timeText = 'Just now';
    } else if (diffInHours < 24) {
        timeText = `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
        timeText = `${diffInDays}d ago`;
    } else {
        timeText = date.toLocaleDateString();
    }

    return (
        <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {timeText}
        </div>
    );
};

// Expandable Message Component
const ExpandableMessage = ({ message }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 150;
    const shouldTruncate = message.length > maxLength;

    if (!shouldTruncate) {
        return <p className="text-sm text-gray-700">{message}</p>;
    }

    return (
        <div>
            <p className="text-sm text-gray-700">
                {isExpanded ? message : `${message.substring(0, maxLength)}...`}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-[#FB3026] hover:text-blue-800 mt-1 font-medium"
            >
                {isExpanded ? 'See less' : 'See more'}
            </button>
        </div>
    );
};

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedPond, setSelectedPond, ponds }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026]"
                />
            </div>

            {/* Pond Filter */}
            <div className="relative">
                <select
                    value={selectedPond}
                    onChange={(e) => setSelectedPond(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026] appearance-none bg-white"
                >
                    <option value="">All Ponds</option>
                    {ponds.map(pond => (
                        <option key={pond.id} value={pond.id}>
                            {pond.name}
                        </option>
                    ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
        </div>
    </div>
);

// Tips Table Component
const TipsTable = ({ tips, isLoading, onView, onDelete }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FB3026] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tips...</p>
                </div>
            </div>
        );
    }

    if (!tips || tips.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tips found</h3>
                    <p className="text-gray-600">Tips will appear here when available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tip
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pond ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tips.map((tip) => (
                            <tr key={tip.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <ExpandableMessage message={tip.message} />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    Pond {tip.pond_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <TimeDisplay timestamp={tip.created_at} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onView(tip)}
                                            className="p-1 text-[#FB3026] hover:text-blue-800 hover:bg-blue-50 rounded"
                                            title="View Tip"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(tip)}
                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            title="Delete Tip"
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

const Tips = () => {
    const [tips, setTips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPond, setSelectedPond] = useState('');
    const [ponds, setPonds] = useState([]);

    useEffect(() => {
        fetchTips();
        fetchPonds();
    }, []);

    const fetchTips = async () => {
        setIsLoading(true);
        try {
            const response = await tipsServices.getTips();
            if (response.success) {
                setTips(response.data.items || []);
            }
        } catch (error) {
            console.error('Error fetching tips:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPonds = async () => {
        try {
            // This would need to be implemented based on your ponds API
            // For now, we'll create a mock list based on the tips data
            const uniquePondIds = [...new Set(tips.map(tip => tip.pond_id))];
            setPonds(uniquePondIds.map(id => ({ id, name: `Pond ${id}` })));
        } catch (error) {
            console.error('Error fetching ponds:', error);
        }
    };

    // Filter tips based on search and filters
    const filteredTips = tips.filter(tip => {
        const matchesSearch = tip.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPond = !selectedPond || tip.pond_id.toString() === selectedPond;

        return matchesSearch && matchesPond;
    });

    const handleView = (tip) => {
        // Show tip details in a modal or expand the row
        alert(`Tip Details:\n\n${tip.message}`);
    };

    const handleDelete = async (tip) => {
        if (window.confirm(`Are you sure you want to delete this tip?`)) {
            const response = await tipsServices.deleteTip(tip.id);
            if (response.success) {
                fetchTips(); // Refresh the list
            } else {
                console.error('Delete failed:', response.message);
            }
        }
    };

    return (
        <div className="min-h-screen px-12 bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Tips Management</h1>
                            <p className="text-sm text-gray-600">
                                View and manage system tips ({tips.length} total tips)
                            </p>
                        </div>

                    </div>
                </div>

                {/* Search and Filters */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedPond={selectedPond}
                    setSelectedPond={setSelectedPond}
                    ponds={ponds}
                />

                {/* Tips Table */}
                <div className="mb-6">
                    <TipsTable
                        tips={filteredTips}
                        isLoading={isLoading}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tips; 