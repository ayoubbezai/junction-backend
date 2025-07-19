<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use App\Models\Pond;
use App\Models\Region;
use App\Models\Sensor;
use App\Models\Alert;
use App\Models\Tip;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class StatUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct()
    {
        $weeklyPhDo = \App\Models\Sensor_reading::selectRaw("DATE_FORMAT(created_at, '%a') as date, AVG(ph) as avgPH, AVG(dissolved_oxygen) as avgDO")
        ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
        ->groupBy(DB::raw("DATE_FORMAT(created_at, '%a')"))
        ->orderBy(DB::raw("MIN(created_at)"), 'asc')
        ->get();
        
        $this->data = [
            'ponds_count' => Pond::count(),
            'regions_count' => Region::count(),
            'sensors_count' => Sensor::count(),
            'latest_alerts' => Alert::with('pond')->latest()->limit(5)->get(),
            'latest_tips' => Tip::with('pond')->latest()->limit(5)->get(),
            'weekly_ph_do' => $weeklyPhDo,
        ];
    }

    public function broadcastOn()
    {
        return new Channel('dashboard');
    }

    public function broadcastAs()
    {
        return 'dashboard.updated';
    }
}
