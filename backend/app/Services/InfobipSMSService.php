<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InfobipSMSService
{
    protected $baseUrl;
    protected $apiKey;
    protected $sender;

    public function __construct()
    {
        $this->baseUrl = config('services.infobip.base_url');
        $this->apiKey = config('services.infobip.api_key');
        $this->sender = config('services.infobip.sender');
    }

    public function sendSms($to, $message)
    {
        $url = $this->baseUrl . '/sms/2/text/advanced';

        $response = Http::withHeaders([
            'Authorization' => 'App ' . $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post($url, [
            'messages' => [
                [
                    'from' => $this->sender,
                    'destinations' => [
                        ['to' => $to]
                    ],
                    'text' => $message,
                ]
            ]
        ]);

        return $response->json();
    }
}
