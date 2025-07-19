<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use App\Models\Sensor_reading;

class SensorReadingCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct(Sensor_reading $reading)
    {
        $reading->loadMissing('sensor');
        $this->data = [
            'reading' => $reading->toArray(),
            'message' => 'New sensor reading recorded',
            'timestamp' => now()->toISOString()
        ];
    }

    public function broadcastOn()
    {
        return new Channel('sensor-readings');
    }

    public function broadcastAs()
    {
        return 'sensor-reading.created';
    }
} 