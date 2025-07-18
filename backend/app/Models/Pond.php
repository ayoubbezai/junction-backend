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
        'region_id'
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}
