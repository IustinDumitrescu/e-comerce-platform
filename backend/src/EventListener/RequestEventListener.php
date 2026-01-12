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

        $pathInfo = $request->getPathInfo();
        
        if (!str_starts_with($pathInfo, '/api')) {
            return;
        }

        $token = $request->headers->get('X-Frontend-Token');
        if (!str_starts_with($pathInfo, '/api/images') 
            && ($token !== $this->frontendToken || !$request->isXmlHttpRequest())
        ) {

            $event->setResponse(new JsonResponse([
                'error' => 'Invalid frontend token'
            ], 403));
        }
    }
}