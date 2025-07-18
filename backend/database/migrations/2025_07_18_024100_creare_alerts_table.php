<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //

        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->string('message');
            $table->unsignedBigInteger('pond_id');
            $table->timestamps();
            
            // Add foreign key constraint
            $table->foreign('pond_id')->references('id')->on('ponds')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
