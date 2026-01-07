<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController 
{
     #[Route('/api/me', name: 'api_me', methods:['GET'])]
    public function me() 
    {
        $user = $this->getUser();

        return new JsonResponse([
            "id" => $user->getId(),
            "email" => $user->getEmail(),
            "roles" => $user->getRoles(),
            "name" => $user->getName()
        ]);
    }

    #[Route('/api/register', name: 'api_register', methods:['POST'])]
    public function register(
        Request $request, 
        UserRepository $userRep,
        UserPasswordHasherInterface $userPasswordHasher
    ): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return new JsonResponse(
                ['type' => 'error', 'message' => 'Invalid request body'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $validate = $this->validateData($data);

        if (isset($validate["type"])) {
            return new JsonResponse($validate, Response::HTTP_BAD_REQUEST);
        }

        if ($userRep->findOneBy(["email" => $email = strtolower($validate["email"])])) {
            return new JsonResponse(
                ["type" => "error", "message" => "This account already exists !"],
                 Response::HTTP_CONFLICT
            );
        }

        $user = new User()
            ->setName($data["name"])
            ->setEmail($email)
            ->setRoles([User::ROLE_USER])
            ->setVerified(false)
            ->setCreated((new \DateTime()))
            ->setUpdatedAt(null);

        $userRep->save(
            $user->setPassword($userPasswordHasher->hashPassword($user, $data["password"]))
        );

        return new JsonResponse(["type" => "success"],  Response::HTTP_CREATED);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout() 
    {

    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login()
    {
        // will never be called, the authenticator intercepts it
    }

    private function validateData(array $data): array 
    {
        if (empty($data["name"]) || strlen($data["name"]) > 100 || strlen($data["name"]) < 3) {
            return ["type" => "error", "message" => "Name must have 3 to 100 characters"];
        }

        if (empty($data["email"]) || !filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
            return ["type" => "error", "message" => "Email can't be empty"];
        }

        if (empty($data["password"]) || strlen($data["password"]) > 32 || strlen($data["password"]) < 8) {
            return ["type" => "error", "message" => "Password must have 8 to 32 characters"];
        }

        return $data;
    }
}