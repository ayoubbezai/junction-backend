<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    
    protected $fillable = [
        'region_name',
    ];

    public function ponds()
    {
        return $this->hasMany(Pond::class);
    }
}
