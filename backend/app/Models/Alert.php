<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    //

    protected $fillable = [
        'pond_id',
        'message',
        'level',
        'timestamp'
    ];

    public function pond()
    {
        return $this->belongsTo(Pond::class);
    }
}
