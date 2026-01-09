<?php

namespace App\Controller;

use App\Service\CategoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ProductsController extends AbstractController 
{
    #[Route(path: '/api/my-products', name: 'my_products')]
    public function myProducts() 
    {
        return new JsonResponse([]);
    }

    #[Route(path: '/api/categories', name: 'products_categories', methods:['GET'])]
    public function categories(CategoryService $categoryService) 
    {
        $categories = $categoryService->getCategories();

        return new JsonResponse($categories);
    }
}