<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::apiResource('/regions', App\Http\Controllers\RegionController::class);
Route::apiResource('/ponds', App\Http\Controllers\PondController::class);
Route::apiResource('/sensors', App\Http\Controllers\SensorController::class);
Route::apiResource('/sensor_reading', App\Http\Controllers\Sensor_readingController::class);
Route::apiResource('/alerts', App\Http\Controllers\AlertController::class);
Route::apiResource('/tips', App\Http\Controllers\TipController::class);
Route::get('/stat',[App\Http\Controllers\StatController::class,'getStat']);
Route::post('/sms', [App\Http\Controllers\SMSController2::class, 'send']);
Route::post('/pdfs', [App\Http\Controllers\StorePdfController::class, 'store']);
Route::get('/pdfs', [App\Http\Controllers\StorePdfController::class, 'index']);
Route::get('/pdfs/all', [App\Http\Controllers\StorePdfController::class, 'getAllPdfs']);
Route::get('/pdfs/download/{filename}', [App\Http\Controllers\StorePdfController::class, 'download']);
Route::get('/pdfs/download-file/{filename}', [App\Http\Controllers\StorePdfController::class, 'downloadFile']);
Route::delete('/pdfs/{filename}', [App\Http\Controllers\StorePdfController::class, 'destroy']);