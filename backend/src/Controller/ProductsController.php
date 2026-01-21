<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Service\ProductService;
use App\Enum\OrderType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductsController extends AbstractController 
{
    #[Route(path: '/api/images/product/{fileName}', name: 'product_images', methods:['GET'])]
    public function productImages(
       ProductService $productService,
       string $fileName
    ) 
    {
        $file = $productService->getProductImage($fileName);

        if (!$file) {
            return new Response('File not found', 404);
        }

        $response = new BinaryFileResponse($file);
        $response->setPublic();           // mark as cacheable
        $response->setMaxAge(3600);       // cache 1 hour
        $response->setSharedMaxAge(3600); // for proxies
        $response->headers->addCacheControlDirective('must-revalidate', true);
        $response->headers->set('Content-Type', mime_content_type($file));

        return $response;
    }

    #[Route(path: '/api/orders-{type}', name: 'user_orders', methods: ['GET'])]
    public function orders(
        ProductService $productService,
        Request $request,
        string $type 
    )
    {
        $user = $this->getUser();

        $orderType = OrderType::tryFrom($type);

        if (!$user || !$orderType) {
            return $this->json([
                'status' => 'error',
                'message' => 'You must be logged in to place an order'
            ], 401); // 401 Unauthorized
        }

        $parameters = $request->query->all();

        return new JsonResponse($productService->getMyOrders($user, $orderType, $parameters));
    }

    #[Route(path: '/api/create-order', name: 'create_product_order', methods:['POST'])]
    public function createOrder(
        ProductService $productService,
        Request $request
    ) 
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'status' => 'error',
                'message' => 'You must be logged in to place an order'
            ], 401); // 401 Unauthorized
        }

        $items = json_decode($request->getContent(), true);

        if (empty($items["products"])) {
            return $this->json([
                'status' => 'error',
                'message' => 'You have no product'
            ], 401); // 401 Unauthorized
        }

        return new JsonResponse($productService->handleOrder($user, $items["products"]));
    }

    #[Route(path: '/api/products', name: 'products_listing')]
    public function getProducts(
        ProductService  $productService,
        Request $request
    )
    {
        $products = $productService->findByParams(
            $request->query->all()
        );

        $products["products"] = $this->normalizeProducts($products["products"]);

        return new JsonResponse($products);
    }

    #[Route(path: '/api/products/product-{id}', name: 'view_product', requirements:["id" => "\d+"])]
    public function viewMyProduct(
        ProductRepository $productRepository,
        int $id
    ) 
    {
        $product = $productRepository->find($id);

        if (!$product) {
             return new JsonResponse([
                'status' => 'error',
                'message' => 'You must be logged in to create a product'
            ], 401);
        }

        return new JsonResponse($this->normalizeProducts([$product])[0]);
    }

    #[Route(path: '/api/my-products', name: 'my_products')]
    public function myProducts(
        Request $request, 
        ProductRepository $productRepository
    ) 
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'status' => 'error',
                'message' => 'You must be logged in to create a product'
            ], 401); // 401 Unauthorized
        }

        $params = $request->query->all();

        $products = $productRepository->getMyProducts($params, $user);    

        return new JsonResponse($this->normalizeProducts($products));
    }

    #[Route(path: '/api/my-products/edit/{id}', name: 'my_products_edit', methods:['POST'], requirements:['id' => '\d+'])]
    public function editProduct(
        Request $request,
        ProductService $productService,
        ProductRepository $productRepository,
        int $id
    ) 
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'status' => 'error',
                'message' => 'You must be logged in to create a product'
            ], 401); // 401 Unauthorized
        }

        $product = $productRepository->findOneBy(["id" => $id, "owner" => $user]);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found', 404]);
        }

        $result = $productService->createProduct(
            $user,
            $request->request->all(), 
            $request->files->get('image'),
            $product
        );

         return new JsonResponse(
            $result, 
            $result["type"] === 'error' ? Response::HTTP_BAD_REQUEST : 200
        );
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
            "categoryId" => $product->getProductCategory()->getId(),
            "active" => $product->isActive(),
            "image" => $product->getImage(),
            "createdAt" => $product->getCreatedAt()->format('d.m.Y H:i'),
            "updatedAt" => $product->getUpdatedAt()?->format('d.m.Y H:i')
        ], $products); 
    }
}