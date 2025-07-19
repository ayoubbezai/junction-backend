import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sensorServices } from '../services/SensorServices';
import { pondServices } from '../services/PondServices';
import { useSensorReadings } from '../hooks/useSensorReadings';
import { MapPin, Thermometer, Droplets, Activity, Users, Database, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const statusColor = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'inactive') return 'bg-gray-100 text-gray-700';
    return 'bg-yellow-100 text-yellow-700';
};

const PondDetails = () => {
    const { pondId } = useParams();
    const [pond, setPond] = useState(null);
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(true);
    // Sensor readings state
    const [readings, setReadings] = useState([]);
    const [readingLoading, setReadingLoading] = useState(true);
    const [readingPage, setReadingPage] = useState(1);
    const [readingTotalPages, setReadingTotalPages] = useState(1);
    const [readingTotalItems, setReadingTotalItems] = useState(0);
    const [readingPerPage, setReadingPerPage] = useState(15);
    const [pendingReadings, setPendingReadings] = useState([]);

    // Real-time sensor readings
    const { newReading, isConnected } = useSensorReadings(pondId);
    const [highlightedReadingId, setHighlightedReadingId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {
        fetchPond();
        fetchSensors();
        fetchReadings(1);
        // eslint-disable-next-line
    }, [pondId]);

    // Log readings array after every update
    useEffect(() => {
        console.log('[Table] Current readings:', readings);
    }, [readings]);

    // Handle real-time updates (simple: unshift new reading to readings)
    useEffect(() => {
        if (!newReading) return;
        const readingObj = newReading?.data?.reading || newReading?.reading || newReading;
        setReadings(prev => {
            if (prev.some(r => r.id === readingObj.id)) return prev;
            const arr = prev.slice();
            arr.unshift(readingObj);
            return arr.length > readingPerPage ? arr.slice(0, readingPerPage) : arr;
        });
        setHighlightedReadingId(readingObj.id);
        const timeout = setTimeout(() => setHighlightedReadingId(null), 3000);
        return () => clearTimeout(timeout);
    }, [newReading, readingPerPage]);

    const fetchPond = async () => {
        const res = await pondServices.getPondById(pondId);
        if (res.success) setPond(res.data);
    };

    const fetchSensors = async () => {
        setLoading(true);
        const res = await sensorServices.getSensorsByPondId(pondId);
        if (res.success) setSensors(res.data || []);
        setLoading(false);
    };

    const fetchReadings = async (page = 1) => {
        setReadingLoading(true);
        try {
            const res = await sensorServices.getSensorReadingsByPondId(pondId, page);
            if (res.success && res.data) {
                let items = res.data.items || [];
                // Only merge pendingReadings on the first page
                if (page === 1 && pendingReadings.length > 0) {
                    const ids = new Set(pendingReadings.map(r => r.id));
                    items = [...pendingReadings, ...items.filter(r => !ids.has(r.id))];
                }
                setReadings(items);
                setReadingPage(res.data.current_page || 1);
                setReadingTotalPages(res.data.total_pages || 1);
                setReadingTotalItems(res.data.total_items || 0);
                setReadingPerPage(res.data.per_page || 15);
            } else {
                setReadings([]);
            }
        } catch (e) {
            setReadings([]);
        }
        setReadingLoading(false);
    };

    if (!pond) return <div className="p-8">Loading pond details...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="max-w-5xl mx-auto px-4 pt-10">
                {/* Hero Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-blue-100 rounded-full p-4 shadow-md">
                        <MapPin className="w-10 h-10 text-blue-700" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{pond.pond_name}</h1>
                        <div className="text-gray-600 flex items-center space-x-2">
                            <span className="inline-flex items-center"><MapPin className="w-4 h-4 mr-1" />{pond.location}</span>
                            <span className="mx-2">|</span>
                            <span className="inline-flex items-center"><Users className="w-4 h-4 mr-1" />Region: {pond.region?.region_name || '-'}</span>
                            <span className="mx-2">|</span>
                            <span className="inline-flex items-center"><Database className="w-4 h-4 mr-1" />Size: {pond.size}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-8 mb-8">
                    <div className="flex-1 bg-white rounded-xl shadow p-6 mb-4 md:mb-0 border border-gray-100">
                        <div className="flex items-center mb-2">
                            <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                            <span className="font-semibold text-gray-700">Safe Ranges</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-1">pH: <span className="font-bold">{pond.safe_range?.ph?.min}-{pond.safe_range?.ph?.max} {pond.safe_range?.ph?.unit}</span></div>
                        <div className="text-sm text-gray-700 mb-1">Temp: <span className="font-bold">{pond.safe_range?.temperature?.min}-{pond.safe_range?.temperature?.max}°{pond.safe_range?.temperature?.unit}</span></div>
                        <div className="text-sm text-gray-700">O₂: <span className="font-bold">{pond.safe_range?.oxygen?.min}-{pond.safe_range?.oxygen?.max} {pond.safe_range?.oxygen?.unit}</span></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-xl shadow p-6 border border-gray-100">
                        <div className="text-5xl font-extrabold text-blue-700 mb-2">{sensors.length}</div>
                        <div className="text-gray-600 font-semibold">Sensors</div>
                        <div className="mt-2 text-xs text-gray-400">Created: {new Date(pond.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="mb-6">
                    <Link to="/ponds" className="text-[#FB3026] hover:underline">← Back to Ponds</Link>
                </div>
                <hr className="my-8 border-gray-200" />
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">
                    <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center"><Database className="w-5 h-5 mr-2" />Sensors</h3>
                    {loading ? (
                        <div>Loading sensors...</div>
                    ) : sensors.length === 0 ? (
                        <div className="text-gray-500">No sensors found for this pond.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Serial</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Unit</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Installed At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensors.map(sensor => (
                                        <tr key={sensor.id} className="border-t hover:bg-blue-50 transition-colors">
                                            <td className="px-4 py-2 flex items-center space-x-2">
                                                {sensor.status === 'active' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                                <span>{sensor.type}</span>
                                            </td>
                                            <td className="px-4 py-2">{sensor.hardware_serial}</td>
                                            <td className="px-4 py-2">{sensor.unit}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(sensor.status)}`}>{sensor.status}</span>
                                            </td>
                                            <td className="px-4 py-2">{sensor.installed_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Sensor Readings Table */}
                {showToast && (
                    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
                        {toastMsg}
                    </div>
                )}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-700" />
                            <h3 className="text-xl font-bold text-blue-700">Sensor Readings</h3>
                            <Info className="w-4 h-4 ml-2 text-gray-400" title="Historical sensor readings for this pond." />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} title={isConnected ? 'Real-time connected' : 'Real-time disconnected'}></div>
                            <span className="text-xs text-gray-500">{isConnected ? 'Live' : 'Offline'}</span>
                        </div>
                    </div>
                    {readingLoading ? (
                        <div>Loading readings...</div>
                    ) : readings.length === 0 ? (
                        <div className="text-gray-500">No readings found for this pond.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">pH</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Dissolved O₂</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Water Temp</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Air Temp</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Secchi Depth</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-800">Water Depth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {readings.map((reading, idx) => (
                                        <tr key={reading.id} className={
                                            `border-t transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`
                                        }>
                                            <td className="px-4 py-2 flex items-center">
                                                {highlightedReadingId === reading.id && (
                                                    <span className="inline-block mr-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-bounce">
                                                        NEW
                                                    </span>
                                                )}
                                                <span title={reading.created_at || reading.date}>
                                                    {new Date(reading.created_at || reading.date).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2" title={reading.ph ?? ''}>{reading.ph ?? '-'}</td>
                                            <td className="px-4 py-2" title={reading.dissolved_oxygen ?? ''}>{reading.dissolved_oxygen ?? '-'}</td>
                                            <td className="px-4 py-2" title={reading.water_temp ?? ''}>{reading.water_temp ?? '-'}</td>
                                            <td className="px-4 py-2" title={reading.air_temp ?? ''}>{reading.air_temp ?? '-'}</td>
                                            <td className="px-4 py-2" title={reading.secchi_depth ?? ''}>{reading.secchi_depth ?? '-'}</td>
                                            <td className="px-4 py-2" title={reading.water_depth ?? ''}>{reading.water_depth ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Pagination Controls */}
                    <div className="flex flex-col items-center justify-center mt-6 space-y-2">
                        <div className="text-sm text-gray-600">
                            Page {readingPage} of {readingTotalPages} ({readingTotalItems} total readings)
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => fetchReadings(readingPage - 1)}
                                disabled={readingPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchReadings(readingPage + 1)}
                                disabled={readingPage === readingTotalPages}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PondDetails; 