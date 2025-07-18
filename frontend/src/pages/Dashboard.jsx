import React, { useEffect, useState } from 'react';
import { User, Map, Cpu, Bell, Info } from 'lucide-react';
import { StatServices } from '../services/StatServices';
import initializePusher from '../lib/echo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';

const StatCard = ({ label, value, icon, isLoading = false }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200 p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">{icon}</div>
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            {isLoading ? (
                <div className="h-8 w-3/4 bg-gray-100 rounded-lg animate-pulse"></div>
            ) : (
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            )}
        </div>
    </div>
);

const StatCards = ({ stat, isLoading }) => {
    const stats = [
        {
            label: 'Total Ponds',
            value: stat?.ponds_count ?? '—',
            icon: <Map className="text-blue-600" size={20} />,
        },
        {
            label: 'Total Regions',
            value: stat?.regions_count ?? '—',
            icon: <User className="text-blue-600" size={20} />,
        },
        {
            label: 'Total Sensors',
            value: stat?.sensors_count ?? '—',
            icon: <Cpu className="text-blue-600" size={20} />,
        },
        {
            label: 'Active Alerts',
            value: stat?.latest_alerts?.length ?? '—',
            icon: <Bell className="text-blue-600" size={20} />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <StatCard
                    key={`stat-card-${index}`}
                    {...stat}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};

const AlertBadge = ({ level }) => {
    const colorMap = {
        critical: 'bg-red-100 text-red-800',
        warning: 'bg-amber-100 text-amber-800',
        info: 'bg-blue-100 text-blue-800',
        default: 'bg-gray-100 text-gray-800'
    };

    const color = colorMap[level?.toLowerCase()] || colorMap.default;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {level}
        </span>
    );
};

const AlertsTable = ({ alerts = [], isLoading }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="mr-2 text-blue-600" size={18} /> Recent Alerts
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pond</th>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="px-5 py-4 text-center text-sm text-gray-500">
                                <div className="animate-pulse flex justify-center">
                                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                </div>
                            </td>
                        </tr>
                    ) : alerts.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-5 py-4 text-center text-sm text-gray-500">No alerts found</td>
                        </tr>
                    ) : (
                        alerts.map((alert, idx) => (
                            <tr key={alert.id || idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4 whitespace-normal max-w-xs md:max-w-sm lg:max-w-md text-sm font-medium text-gray-900">
                                    {alert.message}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <AlertBadge level={alert.level} />
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {alert.pond?.pond_name || '—'}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {alert.created_at ? new Date(alert.created_at).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const TipRow = ({ tip }) => {
    const [expanded, setExpanded] = React.useState(false);
    const maxChars = 120;
    const message = tip.message || tip.tip || '—';
    const isLong = message.length > maxChars;
    const displayText = !expanded && isLong ? message.slice(0, maxChars) + '...' : message;

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-5 py-4 text-sm text-gray-900">
                <div className="whitespace-pre-line">
                    {displayText}
                    {isLong && (
                        <button
                            className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
                            onClick={() => setExpanded(e => !e)}
                        >
                            {expanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                {tip.pond?.pond_name || '—'}
            </td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                {tip.created_at ? new Date(tip.created_at).toLocaleString() : '—'}
            </td>
        </tr>
    );
};

const TipsTable = ({ tips = [], isLoading }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="mr-2 text-blue-600" size={18} /> Recent Tips
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/3">Tip</th>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pond</th>
                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={3} className="px-5 py-4 text-center text-sm text-gray-500">
                                <div className="animate-pulse flex justify-center">
                                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                </div>
                            </td>
                        </tr>
                    ) : tips.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-5 py-4 text-center text-sm text-gray-500">No tips available</td>
                        </tr>
                    ) : (
                        tips.map((tip, idx) => <TipRow key={tip.id || idx} tip={tip} />)
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

const DashboardGraph = ({ chartData }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow p-6 h-full flex flex-col">
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Water Quality Trends</h3>
            <p className="text-sm text-gray-500">Average values across all ponds</p>
        </div>
        <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 13, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 13, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 10]}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 13, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 10]}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            fontSize: 13,
                            color: '#111827',
                            fontWeight: 400,
                        }}
                        labelStyle={{ color: '#2563eb', fontWeight: 600 }}
                        itemStyle={{ fontWeight: 400 }}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
                        formatter={(value, entry) => (
                            <span style={{ color: entry.color, marginLeft: 4 }}>{entry.value === 'avgPH' ? 'Avg pH' : 'Avg DO (mg/L)'}</span>
                        )}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgPH"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 1.5 }}
                        activeDot={{ r: 7, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                        name="Avg pH"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgDO"
                        stroke="#38bdf8"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#38bdf8', stroke: '#fff', strokeWidth: 1.5 }}
                        activeDot={{ r: 7, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
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
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const dynamicChartData = (() => {
        if (!isLoading && stat?.weekly_ph_do && Array.isArray(stat.weekly_ph_do)) {
            // Map backend data to a lookup by day
            const lookup = Object.fromEntries(
                stat.weekly_ph_do.map(d => [d.date, {
                    name: d.date,
                    avgPH: d.avgPH ? parseFloat(d.avgPH) : 0,
                    avgDO: d.avgDO ? parseFloat(d.avgDO) : 0,
                }])
            );
            // Ensure all days are present, fill missing with 0
            return WEEK_DAYS.map(day => lookup[day] || { name: day, avgPH: 0, avgDO: 0 });
        }
        return chartData;
    })();

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">


                <div className="mb-8">
                    <StatCards stat={stat} isLoading={isLoading} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <DashboardGraph chartData={dynamicChartData} />
                    </div>
                    <div className="space-y-6">
                        <AlertsTable alerts={stat?.latest_alerts || []} isLoading={isLoading} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                        <TipsTable tips={stat?.latest_tasks || []} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;