<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Sensor_readingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            
            $request->validate([
                "per_page" => "nullable|integer|min:1|max:100",
                "page" => "nullable|integer|min:1",
                "search" => "nullable|string|max:255",
            ]);

            $sensors_reading = Sensors_reading::with('sensor');
            $perPage = $request->get('per_page', 15);
            $perPage = max(1, min($perPage, 100));

            // Handle search parameter
            if ($request->filled('search')) {
                $search = trim($request->get('search'));
                if (strlen($search) <= 255) { 
                    $sensors_reading->where(function ($query) use ($search) {
                        $query->where('pod_name', 'like', '%' . $search . '%');
                    });
                }
            }


            $paginatedSensors = $sensors_reading->paginate($perPage);

            
            return response()->json([
                'success' => true,
                'message' => 'Sensors retrieved successfully.',
                'data' =>[
                    'current_page' => $paginatedSensors->currentPage(),
                    'total_pages' => $paginatedSensors->lastPage(),
                    'total_items' => $paginatedSensors->total(),
                    'per_page' => $perPage,
                    'items' => $paginatedSensors->items()
                ]
            ], Response::HTTP_OK);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred while retrieving sensors.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sensors_reading. Please try again later.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
