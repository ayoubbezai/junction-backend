<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor_reading extends Model
{
    protected $table = 'sensor_readings';

    protected $fillable = [
        'sensor_id',
        'timestamp',
        'value',
        'unit'
    ];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }
}
