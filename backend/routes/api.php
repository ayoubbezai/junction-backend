<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::apiResource('/regions', App\Http\Controllers\RegionController::class);
Route::apiResource('/ponds', App\Http\Controllers\PondController::class);
