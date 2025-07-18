<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pond extends Model
{
    //
    protected $fillable = [
        'pond_name',
        'location',
        'size',
        'region_id',
        'safe_range'
    ];

    protected $casts = [
        'safe_range' => 'array',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }  
    public function sensor()
    {
        return $this->hasMany(Sensor::class);
    }
}
