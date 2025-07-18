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
            $table->dateTime('date');
            $table->decimal('salinity', 8, 3)->nullable(); // ppt
            $table->decimal('dissolved_oxygen', 8, 3)->nullable(); // mg/L
            $table->decimal('ph', 5, 2)->nullable();
            $table->decimal('secchi_depth', 8, 3)->nullable(); // m
            $table->decimal('water_depth', 8, 3)->nullable(); // m
            $table->decimal('water_temp', 5, 2)->nullable(); // C
            $table->decimal('air_temp', 5, 2)->nullable(); // C
            $table->unsignedBigInteger('pond_id');
            $table->foreign('pond_id')->references('id')->on('ponds')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensor_readings');
    }
};
