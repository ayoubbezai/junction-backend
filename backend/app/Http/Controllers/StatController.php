<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Pond;
use App\Models\Region;
use App\Models\Sensor;
use App\Models\Alert;
use App\Events\StatUpdated;
use App\Models\Tip;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatController extends Controller
{
    public function getStat(){
        try{
            // Get last 7 days' average pH, DO, and water temperature, grouped by day of week (Mon, Tue, ...)
            $weeklyPhDo = \App\Models\Sensor_reading::selectRaw("DATE_FORMAT(created_at, '%a') as date, AVG(ph) as avgPH, AVG(dissolved_oxygen) as avgDO, AVG(water_temp) as avgTemp")
                ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
                ->groupBy(DB::raw("DATE_FORMAT(created_at, '%a')"))
                ->orderBy(DB::raw("MIN(created_at)"), 'asc')
                ->get();

            $data = [
                'ponds_count' => Pond::count(),
                'regions_count' => Region::count(),
                'sensors_count' => Sensor::count(),
                'latest_alerts' => Alert::with('pond')->latest()->limit(9)->get(),
                'latest_tasks' => Tip::with('pond')->latest()->limit(5)->get(),
                'weekly_ph_do' => $weeklyPhDo,
            ];
            
            event(new StatUpdated($data));

            return response()->json([
                'success' => true,
                'message' => 'state fetched successfully.',
                'data' => $data
            ], Response::HTTP_OK);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get stat.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
