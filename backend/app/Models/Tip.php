<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tip extends Model
{
    protected $fillable = [
        'pond_id',
        'message',
    ];

    public function pond()
    {
        return $this->belongsTo(Pond::class);
    }
}
