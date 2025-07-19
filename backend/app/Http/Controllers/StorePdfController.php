<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;

class StorePdfController extends Controller
{
    /**
     * Store a PDF file and return the URL
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'pdf' => 'required|file|mimes:pdf|max:10240', // 10MB max
            ]);

            $file = $request->file('pdf');
            $fileName = time() . '_' . Str::random(10) . '.pdf';
            
            // Store the file in the 'pdfs' disk
            $path = $file->storeAs('pdfs', $fileName, 'public');
            
            // Generate the URL for localhost
            $url = $this->generatePdfUrl($path);

            return response()->json([
                'success' => true,
                'message' => 'PDF uploaded successfully.',
                'data' => [
                    'filename' => $fileName,
                    'path' => $path,
                    'url' => $url,
                    'download_url' => $this->generateDownloadUrl($fileName),
                    'size' => $file->getSize(),
                    'original_name' => $file->getClientOriginalName()
                ]
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
                'message' => 'Failed to upload PDF.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a list of uploaded PDFs
     */
    public function index()
    {
        try {
            $files = Storage::disk('public')->files('pdfs');
            
            $pdfList = collect($files)->map(function ($file) {
                $filename = basename($file);
                return [
                    'filename' => $filename,
                    'path' => $file,
                    'url' => $this->generatePdfUrl($file),
                    'download_url' => $this->generateDownloadUrl($filename),
                    'size' => Storage::disk('public')->size($file),
                    'last_modified' => Storage::disk('public')->lastModified($file)
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'PDFs retrieved successfully.',
                'data' => $pdfList
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve PDFs.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all PDFs with direct storage URLs
     */
    public function getAllPdfs()
    {
        try {
            $files = Storage::disk('public')->files('pdfs');
            
            $pdfList = collect($files)->map(function ($file) {
                $filename = basename($file);
                return [
                    'filename' => $filename,
                    'url' => $this->generatePdfUrl($file),
                    'size' => Storage::disk('public')->size($file),
                    'last_modified' => Storage::disk('public')->lastModified($file)
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'All PDFs retrieved successfully.',
                'data' => $pdfList
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve PDFs.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Download a PDF file
     */
    public function download($filename)
    {
        try {
            $path = 'pdfs/' . $filename;
            
            if (!Storage::disk('public')->exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'PDF file not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            // Return exactly the same format as index() - as an array
            $pdfData = [
                'filename' => $filename,
                'path' => $path,
                'url' => $this->generatePdfUrl($path),
                'download_url' => $this->generateDownloadUrl($filename),
                'size' => Storage::disk('public')->size($path),
                'last_modified' => Storage::disk('public')->lastModified($path)
            ];

            return response()->json([
                'success' => true,
                'message' => 'PDFs retrieved successfully.',
                'data' => [$pdfData] // Return as array like index()
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve PDF.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actually download the PDF file
     */
    public function downloadFile($filename)
    {
        try {
            $path = 'pdfs/' . $filename;
            
            if (!Storage::disk('public')->exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'PDF file not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            // Get file info
            $filePath = Storage::disk('public')->path($path);
            $originalName = $filename;
            
            // Return file as download response
            return response()->download($filePath, $originalName, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $originalName . '"'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download PDF.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a PDF file
     */
    public function destroy($filename)
    {
        try {
            $path = 'pdfs/' . $filename;
            
            if (!Storage::disk('public')->exists($path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'PDF file not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            Storage::disk('public')->delete($path);

            return response()->json([
                'success' => true,
                'message' => 'PDF deleted successfully.'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete PDF.',
                'errors' => [$e->getMessage()]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Generate proper URL for PDF files
     */
    private function generatePdfUrl($path)
    {
        $baseUrl = config('app.url', 'http://127.0.0.1:8000');
        $baseUrl = rtrim($baseUrl, '/');
        $url = $baseUrl . '/storage/' . $path;
        return $url;
    }

    /**
     * Generate download URL for PDF files
     */
    private function generateDownloadUrl($filename)
    {
        $baseUrl = config('app.url', 'http://127.0.0.1:8000');
        $baseUrl = rtrim($baseUrl, '/');
        $url = $baseUrl . '/api/pdfs/download/' . $filename;
        return $url;
    }
}
