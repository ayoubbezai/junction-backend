<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Sensor_reading;


class Sensor_readingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            
            $request->validate([
                "per_page" => "nullable|integer|min:1|max:100",
                "page" => "nullable|integer|min:1",
                "search" => "nullable|string|max:255",
            ]);

            $sensors_reading = Sensor_reading::with('sensor');
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
        try {
            $data = $request->validate([
                'pond_id' => 'required|exists:ponds,id',
                'date' => 'required|date_format:Y-m-d H:i:s',
                'salinity' => 'nullable|numeric',
                'dissolved_oxygen' => 'nullable|numeric',
                'ph' => 'nullable|numeric',
                'secchi_depth' => 'nullable|numeric',
                'water_depth' => 'nullable|numeric',
                'water_temp' => 'nullable|numeric',
                'air_temp' => 'nullable|numeric',
            ]);

            $reading = Sensor_reading::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Sensor reading created successfully.',
                'data' => $reading
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create sensor reading.',
                'errors' => [$e->getMessage()]
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $reading = Sensor_reading::with('pond')->findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Sensor reading retrieved successfully.',
                'data' => $reading
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor reading not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sensor reading.',
                'errors' => [$e->getMessage()]
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $reading = Sensor_reading::findOrFail($id);
            $data = $request->validate([
                'pond_id' => 'sometimes|exists:ponds,id',
                'date' => 'sometimes|date_format:Y-m-d H:i:s',
                'salinity' => 'nullable|numeric',
                'dissolved_oxygen' => 'nullable|numeric',
                'ph' => 'nullable|numeric',
                'secchi_depth' => 'nullable|numeric',
                'water_depth' => 'nullable|numeric',
                'water_temp' => 'nullable|numeric',
                'air_temp' => 'nullable|numeric',
            ]);
            $reading->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Sensor reading updated successfully.',
                'data' => $reading->fresh('pond')
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor reading not found.'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sensor reading.',
                'errors' => [$e->getMessage()]
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $reading = Sensor_reading::findOrFail($id);
            $reading->delete();
            return response()->json([
                'success' => true,
                'message' => 'Sensor reading deleted successfully.'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor reading not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sensor reading.',
                'errors' => [$e->getMessage()]
            ], 500);
        }
    }
}
