<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor_reading extends Model
{
    protected $table = 'sensor_readings';

    protected $fillable = [
        'sensor_id',
        'pond_id',
        'date',
        'salinity',
        'dissolved_oxygen',
        'ph',
        'secchi_depth',
        'water_depth',
        'water_temp',
        'air_temp'
    ];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class, 'sensor_id', 'id');
    }

    public function pond()
    {
        return $this->belongsTo(Pond::class, 'pond_id', 'id');
    }
}
