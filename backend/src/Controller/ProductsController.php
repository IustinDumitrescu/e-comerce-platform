<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Service\ProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class ProductsController extends AbstractController 
{
    #[Route(path: '/api/my-products', name: 'my_products')]
    public function myProducts(Request $request, ProductRepository $productRepository) 
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'status' => 'error',
                'message' => 'You must be logged in to create a product'
            ], 401); // 401 Unauthorized
        }

        $params = $request->query->all();

        $page = !empty($params["page"]) && filter_var($params["page"], FILTER_VALIDATE_INT)
            ? (int) $params["page"]
            : 1;

        $pageSize = !empty($params["limit"]) && in_array($params["limit"], [10 , 20, 30])   
            ? (int) $params["limit"]
            : 10;

        $products = $productRepository->getMyProducts($params, $user, $page, $pageSize);    

        return new JsonResponse($this->normalizeProducts($products));
    }

    #[Route(path: '/api/my-products/new', name: 'my_products_new', methods:['POST'])]
    public function newProduct(
        Request $request,
        ProductService $productService
    ) 
    {
       $user = $this->getUser();

       if (!$user) {
            return $this->json([
                'status' => 'error',
                'message' => 'You must be logged in to create a product'
            ], 401); // 401 Unauthorized
        }

        $result = $productService->createProduct(
            $user,
            $request->request->all(), 
            $request->files->get('image')
        );

        return new JsonResponse(
            $result, 
            $result["type"] === 'error' ? Response::HTTP_BAD_REQUEST: 201
        );
    }

    #[Route(path: '/api/categories', name: 'products_categories', methods:['GET'])]
    public function categories(ProductService $productService) 
    {
        $categories = $productService->getCategories();

        return new JsonResponse($categories);
    }

    private function normalizeProducts(array $products): array
    {
        if (empty($products)) {
            return [];
        }

        return array_map(static fn (Product $product) => [
            "id" => $product->getId(),
            "title" => $product->getTitle(),
            "description" => $product->getDescription(),
            "price" => $product->getPrice(),
            "category" => $product->getProductCategory()->getName(),
            "active" => $product->isActive(),
            "createdAt" => $product->getCreatedAt()->format('d.m.Y H:i'),
            "updatedAt" => $product->getUpdatedAt()?->format('d.m.Y H:i')
        ], $products); 
    }
}