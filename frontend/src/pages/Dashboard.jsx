import React, { useEffect, useState } from 'react';
import { User, Map, Cpu, Bell, Info } from 'lucide-react';
import { StatServices } from '../services/StatServices';
import initializePusher from '../lib/echo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Clean Stat Card Component with Colors
const StatCard = ({ label, value, icon, isLoading = false, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-[#FB3026] border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
        orange: "bg-orange-50 text-orange-600 border-orange-200"
    };

    const colorStyle = colorClasses[color];

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 group h-full">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg border ${colorStyle} group-hover:scale-105 transition-transform duration-200`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
                {isLoading ? (
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                )}
            </div>
        </div>
    );
};

const StatCards = ({ stat, isLoading }) => {
    const stats = [
        {
            label: 'Total Ponds',
            value: stat?.ponds_count ?? '0',
            icon: <Map size={18} />,
            color: 'blue'
        },
        {
            label: 'Total Regions',
            value: stat?.regions_count ?? '0',
            icon: <User size={18} />,
            color: 'green'
        },
        {
            label: 'Active Sensors',
            value: stat?.sensors_count ?? '0',
            icon: <Cpu size={18} />,
            color: 'purple'
        },
        {
            label: 'Active Alerts',
            value: stat?.latest_alerts?.length ?? '0',
            icon: <Bell size={18} />,
            color: 'orange'
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((statItem, index) => (
                <StatCard
                    key={`stat-card-${index}`}
                    {...statItem}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};

// Clean Alert Badge Component
const AlertBadge = ({ level }) => {
    const colorMap = {
        critical: 'bg-red-100 text-red-700',
        warning: 'bg-yellow-100 text-yellow-700',
        info: 'bg-blue-100 text-blue-700',
        default: 'bg-gray-100 text-gray-700'
    };

    const color = colorMap[level?.toLowerCase()] || colorMap.default;

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {level}
        </span>
    );
};

// Clean Alerts Table Component with Better Message Display
const AlertsTable = ({ alerts = [], isLoading }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Bell className="text-gray-600 mr-2" size={14} />
                    <h3 className="text-xs font-semibold text-gray-900">Recent Alerts</h3>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{alerts.length}</p>
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-3 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-3/5">Message</th>
                        <th scope="col" className="px-3 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-1/5">Level</th>
                        <th scope="col" className="px-3 py-1 text-right text-xs font-medium text-gray-600 uppercase tracking-wider w-1/5">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={3} className="px-3 py-4 text-center">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    <span className="ml-2 text-xs text-gray-500">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    ) : alerts.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-3 py-4 text-center">
                                <p className="text-xs text-gray-500">No alerts found</p>
                            </td>
                        </tr>
                    ) : (
                        alerts.slice(0, 9).map((alert, idx) => (
                            <tr key={alert.id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-3 py-2">
                                    <div className="max-w-full">
                                        <p className="text-xs text-gray-900 leading-tight" title={alert.message}>
                                            {alert.message}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    <AlertBadge level={alert.level} />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-right">
                                    <span className="text-xs text-gray-500 font-mono">
                                        {alert.created_at ? new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// Tip Row Component with Expandable Text
const TipRow = ({ tip, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxChars = 80;
    const message = tip.message || tip.tip || '—';
    const isLong = message.length > maxChars;
    const displayText = !isExpanded && isLong ? message.slice(0, maxChars) + '...' : message;

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-4 py-3">
                <div className="max-w-lg">
                    <p className="text-sm text-gray-900 leading-tight">
                        {displayText}
                        {isLong && (
                            <button
                                className="ml-2 text-[#FB3026] hover:text-blue-800 text-xs font-medium underline"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? 'See less' : 'See more'}
                            </button>
                        )}
                    </p>
                </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-700">
                    {tip.pond?.pond_name || '—'}
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-right">
                <span className="text-xs text-gray-500 font-mono">
                    {tip.created_at ? new Date(tip.created_at).toLocaleString() : '—'}
                </span>
            </td>
        </tr>
    );
};

// Clean Tips Table Component with Expandable Text
const TipsTable = ({ tips = [], isLoading }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Info className="text-gray-600 mr-2" size={16} />
                    <h3 className="text-sm font-semibold text-gray-900">Recent Tips</h3>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{tips.length}</p>
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/3">Tip</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Pond</th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-6 text-center">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    ) : tips.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-500">No tips available</p>
                            </td>
                        </tr>
                    ) : (
                        tips.slice(0, 4).map((tip, idx) => (
                            <TipRow key={tip.id || idx} tip={tip} index={idx} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const chartData = [
    { name: 'Mon', avgPH: 7.2, avgDO: 6.5 },
    { name: 'Tue', avgPH: 7.5, avgDO: 7.1 },
    { name: 'Wed', avgPH: 7.1, avgDO: 6.8 },
    { name: 'Thu', avgPH: 7.8, avgDO: 7.4 },
    { name: 'Fri', avgPH: 7.4, avgDO: 6.9 },
    { name: 'Sat', avgPH: 7.6, avgDO: 7.2 },
    { name: 'Sun', avgPH: 7.3, avgDO: 7.0 },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Clean Chart Component
const DashboardGraph = ({ chartData }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-full flex flex-col">
        <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Water Quality Trends</h3>
            <p className="text-xs text-gray-600">Weekly average values</p>
        </div>
        <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 10]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 10]}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            fontSize: 11,
                            color: '#111827',
                            fontWeight: 500,
                        }}
                        labelStyle={{ color: '#374151', fontWeight: 600 }}
                        itemStyle={{ fontWeight: 500 }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgPH"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1 }}
                        activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1 }}
                        name="Avg pH"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgDO"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 1 }}
                        activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 1 }}
                        name="Avg DO (mg/L)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const Dashboard = () => {
    const [stat, setStat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        StatServices.getStat()
            .then(res => {
                setStat(res?.data || res);
            })
            .catch(() => setStat(null))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const pusherInstance = initializePusher();
        const channel = pusherInstance.subscribe('dashboard');

        channel.bind('pusher:subscription_succeeded', () => {
            console.log('✅ Connected to dashboard channel');
        });

        channel.bind('pusher:subscription_error', (error) => {
            console.error('Failed to subscribe to dashboard channel:', error);
        });

        channel.bind('dashboard.updated', (data) => {
            setStat(data.data);
            console.log('✅ data data to dashboard channel');

        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const dynamicChartData = (() => {
        if (!isLoading && stat?.weekly_ph_do && Array.isArray(stat.weekly_ph_do)) {
            const lookup = Object.fromEntries(
                stat.weekly_ph_do.map(d => [d.date, {
                    name: d.date,
                    avgPH: d.avgPH ? parseFloat(d.avgPH) : 0,
                    avgDO: d.avgDO ? parseFloat(d.avgDO) : 0,
                }])
            );
            return WEEK_DAYS.map(day => lookup[day] || { name: day, avgPH: 0, avgDO: 0 });
        }
        return chartData;
    })();

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">


                {/* Stats Cards */}
                <StatCards stat={stat} isLoading={isLoading} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
                    <div className="xl:col-span-3">
                        <div className="h-80">
                            <DashboardGraph chartData={dynamicChartData} />
                        </div>
                    </div>
                    <div className="xl:col-span-1">
                        <div className="h-80">
                            <AlertsTable alerts={stat?.latest_alerts || []} isLoading={isLoading} />
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mb-6">
                    <TipsTable tips={stat?.latest_tasks || []} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;