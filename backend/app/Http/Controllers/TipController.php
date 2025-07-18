<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Tip;

class TipController extends Controller
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

            $tips = Tip::query();
            $perPage = $request->get('per_page', 15);
            $perPage = max(1, min($perPage, 100));

            if ($request->filled('search')) {
                $search = trim($request->get('search'));
                if (strlen($search) <= 255) {
                    $tips->where('message', 'like', "%$search%");
                }
            }

            $paginatedTips = $tips->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Tips retrieved successfully.',
                'data' => [
                    'current_page' => $paginatedTips->currentPage(),
                    'total_pages' => $paginatedTips->lastPage(),
                    'total_items' => $paginatedTips->total(),
                    'per_page' => $perPage,
                    'items' => $paginatedTips->items()
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
                'message' => 'Failed to retrieve tips.',
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
                'message' => 'required|string',
            ]);

            $tip = Tip::create($data);
            broadcast(new StatUpdated());


            return response()->json([
                'success' => true,
                'message' => 'Tip created successfully.',
                'data' => $tip
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
                'message' => 'Failed to create tip.',
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
            $tip = Tip::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Tip retrieved successfully.',
                'data' => $tip
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tip not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tip.',
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
            $tip = Tip::findOrFail($id);
            $data = $request->validate([
                'pond_id' => 'sometimes|exists:ponds,id',
                'message' => 'sometimes|string|max:255',
            ]);
            $tip->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Tip updated successfully.',
                'data' => $tip
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tip not found.'
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
                'message' => 'Failed to update tip.',
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
            $tip = Tip::findOrFail($id);
            $tip->delete();
            return response()->json([
                'success' => true,
                'message' => 'Tip deleted successfully.'
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tip not found.'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete tip.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
