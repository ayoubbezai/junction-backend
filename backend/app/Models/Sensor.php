<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $table = 'sensor';

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

}
