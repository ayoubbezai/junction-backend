<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use App\Models\Pond;

class PondController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        public function index(Request $request)
    {
        try{
            $request->validate([
                "per_page" => "nullable|integer|min:1|max:100",
                "page" => "nullable|integer|min:1",
                "search" => "nullable|string|max:255",
                "region" => "nullable|integer|exists:regions,id",
            ]);

            $ponds = Pond::with('region');

            // Handle per_page parameter
            $perPage = $request->get('per_page', 15);
            $perPage = max(1, min($perPage, 100));

            // Handle search parameter
            if ($request->filled('search')) {
                $search = trim($request->get('search'));
                if (strlen($search) <= 255) { 
                    $ponds->where(function ($query) use ($search) {
                        $query->where('pond_name', 'like', '%' . $search . '%')
                              ->orWhere('location', 'like', '%' . $search . '%');
                    });
                }
            }

            // Handle region filter
            if ($request->filled('region')) {
                $ponds->where('region_id', $request->get('region'));
            }

            $paginatedPonds = $ponds->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Ponds data retrieved successfully.',
                'data' => [
                    'current_page' => $paginatedPonds->currentPage(),
                    'total_pages' => $paginatedPonds->lastPage(),
                    'total_items' => $paginatedPonds->total(),
                    'per_page' => $perPage,
                    'items' => $paginatedPonds->items()
                ]
            ], Response::HTTP_OK); 

          } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred while retrieving ponds.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve ponds. Please try again later.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $data = $request->validate([
                'region_id' => 'required|exists:regions,id',
                'location' => 'required|string|max:255',
                'size' => 'required|string|max:255',
                'pond_name' => 'required|string|max:255',
                'safe_range' => 'required|array'
            ]);

            $pond = Pond::create($data);
            return response()->json([
                'success' => true,
                'message' => 'Region created successfully.',
                'data' => $pond
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
                'message' => 'Database error occurred while creating region.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create region. Please try again later.',
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
            $pond = Pond::with('region')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Pond retrieved successfully.',
                'data' => $pond
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pond not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve pond. Please try again later.',
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
            $pond = Pond::findOrFail($id);
            
            $data = $request->validate([
                'region_id' => 'sometimes|exists:regions,id',
                'location' => 'sometimes|string|max:255',
                'size' => 'sometimes|string|max:255',
                'pond_name' => 'sometimes|string|max:255',
            ]);
            
            $pond->update($data);
            
            return response()->json([
                'success' => true,
                'message' => 'Pond updated successfully.',
                'data' => $pond->load('region')
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pond not found.'
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
                'message' => 'Database error occurred while updating pond.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update pond. Please try again later.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $pond = Pond::findOrFail($id);
            $pond->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Pond deleted successfully.'
            ], Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pond not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred while deleting pond.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete pond. Please try again later.',
                'debug' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
