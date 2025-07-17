<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;



class AuthController extends Controller
{
    //
    public function login(Request $request)
    {
        try{
            $data = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);
            $user =  User::where('email', $data['email'])->firstOrFail();

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
            ]);

        }catch(\Illuminate\Validation\ValidationException $e){
            return response()->json(['error' => $e->validator->errors()], 422);
        }catch(\Illuminate\Database\Eloquent\ModelNotFoundException $e){
            return response()->json(['error' => 'User not found'], 404);

        }catch(\Exception $e){
            return response()->json(['error' => 'An error occurred during login'], 500);
        }
        return response()->json(['message' => 'Login successful']);
    }

    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);

            $data['password'] = bcrypt($data['password']);
            $user = User::create($data);

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful',
                'token' => $token,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e], 500);
        }
    }
}
