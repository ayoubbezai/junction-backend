import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Thermometer, Droplets, Activity, Calendar, Eye, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { pondServices } from '../services/PondServices';
import AddPondModal from '../components/ui/modals/AddPondModal';
import { useNavigate } from 'react-router-dom';

// Size Badge Component
const SizeBadge = ({ size }) => {
    const colorMap = {
        'Large': 'bg-blue-100 text-blue-700 border-blue-200',
        'Medium': 'bg-green-100 text-green-700 border-green-200',
        'Small': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };

    const color = colorMap[size] || 'bg-gray-100 text-gray-700 border-gray-200';

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
            {size}
        </span>
    );
};

// Safe Range Display Component
const SafeRangeDisplay = ({ safeRange }) => (
    <div className="space-y-1">
        <div className="flex items-center text-xs">
            <Thermometer className="w-3 h-3 text-red-500 mr-1" />
            <span className="text-gray-600">pH: {safeRange.ph.min}-{safeRange.ph.max} {safeRange.ph.unit}</span>
        </div>
        <div className="flex items-center text-xs">
            <Activity className="w-3 h-3 text-orange-500 mr-1" />
            <span className="text-gray-600">Temp: {safeRange.temperature.min}-{safeRange.temperature.max}°{safeRange.temperature.unit}</span>
        </div>
        <div className="flex items-center text-xs">
            <Droplets className="w-3 h-3 text-[#FB3026] mr-1" />
            <span className="text-gray-600">O₂: {safeRange.oxygen.min}-{safeRange.oxygen.max} {safeRange.oxygen.unit}</span>
        </div>
    </div>
);

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedSize, setSelectedSize, selectedRegion, setSelectedRegion, regions }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search ponds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026]"
                />
            </div>

            {/* Size Filter */}
            <div className="relative">
                <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026] appearance-none bg-white"
                >
                    <option value="">All Sizes</option>
                    <option value="Large">Large</option>
                    <option value="Medium">Medium</option>
                    <option value="Small">Small</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Region Filter */}
            <div className="relative">
                <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026] appearance-none bg-white"
                >
                    <option value="">All Regions</option>
                    {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.region_name}</option>
                    ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
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
                            ? 'bg-[#FB3026] text-white'
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

// Ponds Table Component
const PondsTable = ({ ponds, isLoading, onView, onEdit, onDelete }) => {
    const navigate = useNavigate();
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FB3026] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading ponds...</p>
                </div>
            </div>
        );
    }

    if (!ponds || ponds.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No ponds found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Pond Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Safe Ranges</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {ponds.map((pond) => (
                            <tr key={pond.id} className="hover:bg-blue-100 transition-colors duration-150 cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <MapPin className="w-4 h-4 text-[#FB3026]" />
                                        </div>
                                        <div>
                                            <button
                                                className="text-sm font-semibold text-blue-700 underline hover:text-blue-900 focus:outline-none relative overflow-hidden"
                                                style={{ position: 'relative' }}
                                                onClick={e => { e.stopPropagation(); navigate(`/ponds/${pond.id}`); }}
                                                onMouseDown={e => {
                                                    const ripple = document.createElement('span');
                                                    ripple.className = 'absolute bg-blue-200 opacity-50 rounded-full pointer-events-none';
                                                    ripple.style.width = ripple.style.height = '40px';
                                                    ripple.style.left = `${e.nativeEvent.offsetX - 20}px`;
                                                    ripple.style.top = `${e.nativeEvent.offsetY - 20}px`;
                                                    e.currentTarget.appendChild(ripple);
                                                    setTimeout(() => ripple.remove(), 400);
                                                }}
                                            >
                                                {pond.pond_name}
                                            </button>
                                            <p className="text-xs text-gray-500">ID: {pond.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm text-gray-900">{pond.location}</p>
                                        <p className="text-xs text-gray-500">{pond.region?.region_name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <SizeBadge size={pond.size} />
                                </td>
                                <td className="px-6 py-4">
                                    <SafeRangeDisplay safeRange={pond.safe_range} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(pond.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onView(pond)}
                                            className="p-1 text-[#FB3026] hover:text-blue-800 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(pond)}
                                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                            title="Edit Pond"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(pond)}
                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                            title="Delete Pond"
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

const Ponds = () => {
    const [ponds, setPonds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [regions, setRegions] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPonds();
    }, [currentPage]);

    const fetchPonds = async () => {
        setIsLoading(true);
        try {
            const response = await pondServices.getPonds();
            if (response.success) {
                setPonds(response.data.items || response.data || []);
                setTotalPages(response.data.total_pages || 1);
                setTotalItems(response.data.total_items || 0);

                // Extract unique regions for filter
                const uniqueRegions = [...new Map(
                    (response.data.items || response.data || []).map(pond => [pond.region.id, pond.region])
                ).values()];
                setRegions(uniqueRegions);
            }
        } catch (error) {
            console.error('Error fetching ponds:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter ponds based on search and filters
    const filteredPonds = ponds.filter(pond => {
        const matchesSearch = pond.pond_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pond.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pond.region?.region_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSize = !selectedSize || pond.size === selectedSize;
        const matchesRegion = !selectedRegion || pond.region_id === parseInt(selectedRegion);

        return matchesSearch && matchesSize && matchesRegion;
    });

    const handleView = (pond) => {
        navigate(`/ponds/${pond.id}`);
    };

    const handleEdit = (pond) => {
        console.log('Edit pond:', pond);
        // Implement edit functionality
    };

    const handleDelete = (pond) => {
        console.log('Delete pond:', pond);
        // Implement delete functionality
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddPond = () => {
        setIsAddModalOpen(true);
    };

    const handleAddPondSuccess = (newPond) => {
        // Refresh the ponds list
        fetchPonds();
    };

    return (
        <div className="min-h-screen px-12 bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Ponds Management</h1>
                            <p className="text-sm text-gray-600">
                                Manage your aquaculture ponds ({totalItems} total ponds)
                            </p>
                        </div>
                        <button
                            onClick={handleAddPond}
                            className="bg-[#FB3026] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Pond</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    selectedRegion={selectedRegion}
                    setSelectedRegion={setSelectedRegion}
                    regions={regions}
                />

                {/* Ponds Table */}
                <div className="mb-6">
                    <PondsTable
                        ponds={filteredPonds}
                        isLoading={isLoading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Pagination */}
                {!isLoading && filteredPonds.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Add Pond Modal */}
                <AddPondModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleAddPondSuccess}
                />
            </div>
        </div>
    );
};

export default Ponds; 