<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [
        'type',
        'unit',
        'pond_id',
        'hardware_serial',
        'installed_at',
        'status'
    ];

    public function pond()
    {
        return $this->belongsTo(Pond::class);
    }
    public function screen_readings()
    {
        // Placeholder: update to correct related model if needed
        return $this->hasMany(Sensor::class);
    }
}
