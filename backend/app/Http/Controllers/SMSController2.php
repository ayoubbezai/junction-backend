<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\InfobipSMSService;

class SMSController2 extends Controller
{
    public function send(Request $request, InfobipSMSService $sms)
    {
        $request->validate([
            'to' => 'required|string',
            'message' => 'required|string',
        ]);

        $result = $sms->sendSms($request->to, $request->message);

        return response()->json(['result' => $result]);
    }
}
