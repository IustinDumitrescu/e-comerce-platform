<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpFoundation\JsonResponse;

class RequestEventListener 
{
    private string $frontendToken;

    public function __construct(string $frontendToken)
    {
        $this->frontendToken = $frontendToken;
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();

        
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $token = $request->headers->get('X-Frontend-Token');
        if ($token !== $this->frontendToken || !$request->isXmlHttpRequest()) {

            $event->setResponse(new JsonResponse([
                'error' => 'Invalid frontend token'
            ], 403));
        }
    }
}