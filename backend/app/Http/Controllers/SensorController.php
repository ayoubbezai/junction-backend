<?php

namespace App\Http\Controllers;

use App\Models\Sensor;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

class SensorController extends Controller
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
                "status" => "nullable|in:active,inactive,maintenance",
                "pond_id" => "nullable|exists:ponds,id",
            ]);

            $sensors = Sensor::with('pond');
            $perPage = $request->get('per_page', 15);
            $perPage = max(1, min($perPage, 100));

            // Handle search parameter
            if ($request->filled('search')) {
                $search = trim($request->get('search'));
                if (strlen($search) <= 255) { 
                    $sensors->where(function ($query) use ($search) {
                        $query->where('hardware_serial', 'like', '%' . $search . '%')
                              ->orWhere('type', 'like', '%' . $search . '%');
                    });
                }
            }
            
            if($request->filled("status")){
                $sensors->where("status", $request->get("status"));
            }

            if($request->filled("pond_id")){
                $sensors->where("pond_id", $request->get("pond_id"));
            }

            $paginatedSensors = $sensors->paginate($perPage);

            
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
                'message' => 'Failed to retrieve sensors. Please try again later.',
                'debug' => $e->getMessage()
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
                'type' => 'required|string|max:255',
                'unit' => 'required|string|max:255',
                'pond_id' => 'required|exists:ponds,id',
                'hardware_serial' => 'required|string|max:255|unique:sensor,hardware_serial',
                'installed_at' => 'required|date',
                'status' => 'required|in:active,inactive,maintenance'
            ]);

            $sensor = Sensor::create($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Sensor created successfully.',
                'data' => $sensor
            ], Response::HTTP_CREATED);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred while creating sensor.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create sensor. Please try again later.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $sensor = Sensor::with('pond')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Sensor retrieved successfully.',
                'data' => $sensor
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sensor. Please try again later.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $sensor = Sensor::findOrFail($id);
            
            $data = $request->validate([
                'type' => 'sometimes|string|max:255',
                'unit' => 'sometimes|string|max:255',
                'pond_id' => 'sometimes|exists:ponds,id',
                'hardware_serial' => 'sometimes|string|max:255|unique:sensor,hardware_serial,' . $id,
                'installed_at' => 'sometimes|date',
                'status' => 'sometimes|in:active,inactive,maintenance'
            ]);
            
            $sensor->update($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Sensor updated successfully.',
                'data' => $sensor->load('pond')
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred while updating sensor.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sensor. Please try again later.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $sensor = Sensor::findOrFail($id);
            $sensor->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Sensor deleted successfully.'
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred while deleting sensor.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sensor. Please try again later.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
