<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sensor_readings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sensor_id');
            $table->timestamp('timestamp');
            $table->decimal('value', 10, 3);
            $table->string('unit');
            $table->timestamps();

            $table->foreign('sensor_id')->references('id')->on('sensor')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensor_readings');
    }
};
