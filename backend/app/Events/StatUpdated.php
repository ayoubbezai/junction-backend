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

class StatUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct()
    {
        $this->data = [
            'ponds_count' => Pond::count(),
            'regions_count' => Region::count(),
            'sensors_count' => Sensor::count(),
            'latest_alerts' => Alert::with('pond')->latest()->limit(5)->get(),
            'latest_tasks' => Tip::with('pond')->latest()->limit(5)->get(),
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
