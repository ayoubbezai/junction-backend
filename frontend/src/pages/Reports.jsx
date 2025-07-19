import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Download, Trash2, Eye, Calendar, HardDrive, Plus, File, FileImage, FileVideo, FileAudio } from 'lucide-react';
import { reportServices } from '../services/ReportServices';
import { useRef } from 'react';

// File Type Icon Component
const FileTypeIcon = ({ filename }) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    const iconMap = {
        'pdf': <FileText className="w-5 h-5 text-red-500" />,
        'txt': <FileText className="w-5 h-5 text-[#FB3026]" />,
        'doc': <FileText className="w-5 h-5 text-[#FB3026]" />,
        'docx': <FileText className="w-5 h-5 text-[#FB3026]" />,
        'jpg': <FileImage className="w-5 h-5 text-green-500" />,
        'jpeg': <FileImage className="w-5 h-5 text-green-500" />,
        'png': <FileImage className="w-5 h-5 text-green-500" />,
        'mp4': <FileVideo className="w-5 h-5 text-purple-500" />,
        'avi': <FileVideo className="w-5 h-5 text-purple-500" />,
        'mp3': <FileAudio className="w-5 h-5 text-orange-500" />,
        'wav': <FileAudio className="w-5 h-5 text-orange-500" />
    };

    return iconMap[extension] || <File className="w-5 h-5 text-gray-500" />;
};

// File Size Display Component
const FileSizeDisplay = ({ size }) => {
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex items-center text-xs text-gray-500">
            <HardDrive className="w-3 h-3 mr-1" />
            {formatSize(size)}
        </div>
    );
};

// Date Display Component
const DateDisplay = ({ timestamp }) => {
    const date = new Date(timestamp * 1000);
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

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedType, setSelectedType }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026]"
                />
            </div>

            {/* File Type Filter */}
            <div className="relative">
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026] appearance-none bg-white"
                >
                    <option value="">All Types</option>
                    <option value="pdf">PDF</option>
                    <option value="txt">Text</option>
                    <option value="doc">Document</option>
                    <option value="jpg">Image</option>
                    <option value="mp4">Video</option>
                    <option value="mp3">Audio</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
        </div>
    </div>
);

// Reports Grid Component
const ReportsGrid = ({ reports, isLoading, onView, onDownload, onDelete }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FB3026] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                    <p className="text-gray-600">Upload your first report to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reports.map((report) => (
                <div key={report.filename} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <FileTypeIcon filename={report.filename} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
                                    {report.filename}
                                </p>
                                <p className="text-xs text-gray-500">ID: {report.filename.split('_')[0]}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <FileSizeDisplay size={report.size} />
                        <DateDisplay timestamp={report.last_modified} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onView(report)}
                                className="p-1 text-[#FB3026] hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="View Report"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDownload(report)}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Download Report"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(report)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete Report"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const GenerateReportModal = ({ open, onClose, onSubmit, pondOptions }) => {
    const [period, setPeriod] = useState('week');
    const [pond, setPond] = useState('');
    const modalRef = useRef();

    // Close modal if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md pointer-events-auto border border-gray-200"
            >
                <h2 className="text-lg font-bold mb-4">Generate Report</h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        onSubmit({ period, pond });
                    }}
                >
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Period</label>
                        <select
                            value={period}
                            onChange={e => setPeriod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026]"
                        >
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Pond</label>
                        <select
                            value={pond}
                            onChange={e => setPond(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB3026] focus:border-[#FB3026]"
                        >
                            <option value="">Select Pond</option>
                            {pondOptions.map(p => (
                                <option key={p.id} value={p.id}>{p.pond_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#FB3026] text-white hover:bg-blue-700"
                        >
                            Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [pondOptions, setPondOptions] = useState([]);

    useEffect(() => {
        fetchReports();
        fetchPonds();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await reportServices.getReports();
            if (response.success) {
                setReports(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPonds = async () => {
        try {
            // Replace with your actual pond service endpoint
            const res = await fetch('/api/ponds');
            const data = await res.json();
            if (data && data.data) setPondOptions(data.data);
        } catch (e) {
            setPondOptions([]);
        }
    };

    // Filter reports based on search and filters
    const filteredReports = reports.filter(report => {
        const matchesSearch = report.filename.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !selectedType || report.filename.toLowerCase().includes(selectedType.toLowerCase());

        return matchesSearch && matchesType;
    });

    const handleView = (report) => {
        // Open report in new tab
        window.open(report.url, '_blank');
    };

    const handleDownload = async (report) => {
        const response = await reportServices.downloadReport(report.url, report.filename);
        if (response.success) {
            console.log('Download successful');
        } else {
            console.error('Download failed:', response.message);
        }
    };

    const handleDelete = async (report) => {
        if (window.confirm(`Are you sure you want to delete "${report.filename}"?`)) {
            const response = await reportServices.deleteReport(report.filename);
            if (response.success) {
                fetchReports(); // Refresh the list
            } else {
                console.error('Delete failed:', response.message);
            }
        }
    };

    const handleGenerateReport = (form) => {
        // Implement your report generation logic here
        // form.period (week/month), form.pond (pond id)
        setShowModal(false);
    };

    return (
        <div className="min-h-screen px-12 bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports Management</h1>
                            <p className="text-sm text-gray-600">
                                Manage and download your system reports ({reports.length} total reports)
                            </p>
                        </div>
                        <button
                            className="bg-[#FB3026] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Generate Report</span>
                        </button>
                    </div>
                </div>

                {/* Modal for generating report */}
                <GenerateReportModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleGenerateReport}
                    pondOptions={pondOptions}
                />

                {/* Search and Filters */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                />

                {/* Reports Grid */}
                <div className="mb-6">
                    <ReportsGrid
                        reports={filteredReports}
                        isLoading={isLoading}
                        onView={handleView}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default Reports; 