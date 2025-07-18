<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Alert;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'nullable|integer|min:1|max:100',
                'page' => 'nullable|integer|min:1',
                'search' => 'nullable|string|max:255',
            ]);

            $alerts = Alert::query();
            $perPage = $request->get('per_page', 15);
            $perPage = max(1, min($perPage, 100));

            if ($request->filled('search')) {
                $search = trim($request->get('search'));
                if (strlen($search) <= 255) {
                    $alerts->where(function ($query) use ($search) {
                        $query->where('message', 'like', "%$search%")
                              ->orWhere('level', 'like', "%$search%");
                    });
                }
            }

            $paginatedAlerts = $alerts->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Alerts retrieved successfully.',
                'data' => [
                    'current_page' => $paginatedAlerts->currentPage(),
                    'total_pages' => $paginatedAlerts->lastPage(),
                    'total_items' => $paginatedAlerts->total(),
                    'per_page' => $perPage,
                    'items' => $paginatedAlerts->items()
                ]
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
                'message' => 'Failed to retrieve alerts.',
                'errors' => [$e->getMessage()]
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
                'message' => 'required|string|max:255',
                'level' => 'required|string|max:50',
            ]);

            $alert = Alert::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Alert created successfully.',
                'data' => $alert
            ], Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create alert.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $alert = Alert::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Alert retrieved successfully.',
                'data' => $alert
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Alert not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve alert.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $alert = Alert::findOrFail($id);
            $data = $request->validate([
                'sensor_id' => 'sometimes|exists:sensor,id',
                'message' => 'sometimes|string|max:255',
                'level' => 'sometimes|string|max:50',
                'timestamp' => 'sometimes|date',
            ]);
            $alert->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Alert updated successfully.',
                'data' => $alert
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Alert not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update alert.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $alert = Alert::findOrFail($id);
            $alert->delete();
            return response()->json([
                'success' => true,
                'message' => 'Alert deleted successfully.'
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Alert not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete alert.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
