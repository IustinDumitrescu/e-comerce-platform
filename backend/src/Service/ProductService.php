<?php

namespace App\Service;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use App\Entity\SellerOrder;
use App\Entity\User;
use App\Enum\OrderStatus;
use App\Enum\SellerOrderStatus;
use App\Message\OrderNotification;
use App\Repository\OrderRepository;
use App\Repository\ProductCategoryRepository;
use App\Repository\ProductRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use function Symfony\Component\String\u;

class ProductService
{
    public function __construct(
        private readonly CacheInterface $cache,
        private readonly ProductCategoryRepository $categoryRepository,
        private readonly ValidatorInterface $validator,
        private readonly ParameterBagInterface $parameterBag,
        private readonly ProductRepository $productRepository,
        private readonly OrderRepository $orderRepository,
        private readonly MessageBusInterface $meesageBus,
        private readonly LoggerInterface $logger
    )
    {
    }

    public static function array_map_custom(
        callable $function, 
        array $items, 
        string $keyToBeMapped, 
        bool $object = true
    ): array
    {
        if (empty($items)) {
            return [];
        }

        $newItems = [];

        foreach ($items as $item) {
            if ($object) {
                $get = 'get' . u($keyToBeMapped)->title()->toString();

                $newItems[$item->$get()] = $function($item);
            } else {
                $newItems[$item[$keyToBeMapped]] = $function($item);
            }
        }

        return $newItems;
    }

    public function handleOrder(User $buyer, array $items): array 
    {
        $countI = count($items);

        if ($countI > 10) {
            return ["type" => "error", "message" => "You have too many products, maximum 10"];
        }

        $em = $this->orderRepository->getEntityManager();

        $em->beginTransaction();

        try {
            $products = self::array_map_custom(
                static fn (Product $p) => $p,
                $this->productRepository->findByIdList(
                    array_map(static fn(array $item) => $item["id"], $items)
                ),
                'id'
            );       

            if ($countI !== count($products)) {
                throw new \RuntimeException('Error on getting the products');
            }

            [$sellerContainer, $total] = $this->createOrderData($products, $items);

            $em->persist(
                $order = (new Order())
                    ->setBuyer($buyer)
                    ->setPrice($total)
                    ->setStatus(OrderStatus::PENDING)
                    ->setCreatedAt((new \DateTime()))
                    ->setUpdatedAt(null)
            );

            foreach ($sellerContainer as $container) {
                $sellerOrder = (new SellerOrder())
                    ->setOrder($order)
                    ->setStatus(SellerOrderStatus::NEW)
                    ->setSeller($container["seller"])
                    ->setSubtotal($container["total"])
                    ->setCreatedAt((new \DateTime()))
                    ->setUpdatedAt((new \DateTime()));

                $em->persist($sellerOrder);    

                foreach ($container['items'] as $item) {
                    $em->persist(
                        (new OrderItem)
                            ->setSellerOrder($sellerOrder)
                            ->setProduct($item["product"])
                            ->setQuantity($item["quantity"])
                            ->setPrice($item["product"]->getPrice() * $item["quantity"])
                            ->setCreatedAt((NEW \DateTime()))
                            ->setUpdatedAt(null)
                    );
                }
            }
            
            $em->flush();

            $em->commit();

        } catch (\Throwable $e) {
            if ($em->getConnection()->isTransactionActive()) {
                $em->rollback();
            }

            return ["type" => "error", "message" => $e->getMessage()];
        }

        $this->meesageBus->dispatch((new OrderNotification())->setOrderId($order->getId()));

        return ["type" => "success", "message" => "Your order has been created"];
    }

    public function findByParams(array $parameters): array 
    {
        $page = !empty($parameters["page"]) && filter_var($parameters["page"], FILTER_VALIDATE_INT) 
            ? (int) $parameters["page"] 
            : 1; 

        $validate = $this->getProductsValidatedParams($parameters);

        return [
            "products" => $this->productRepository->findByParameters(
                $validate, 
                $validate["orderBy"], 
                $validate["order"],
                $page, 
                $validate["limit"]
            ),
            "totalProducts" => $this->productRepository->countByParamaters($validate)
        ];
    }

    public function createProduct(
        User $user, 
        array $productItems, 
        ?UploadedFile $image,
        ?Product $oldProd = null
    ): array 
    {
        $oldImage = $oldProd?->getImage();

        $defaultDir = $this->parameterBag->get('kernel.project_dir') . '/public/uploads/products';

        $product = ($oldProd ?? (new Product()));
        
        $product
            ->setOwner($user)
            ->setTitle($productItems["name"] ?? '')
            ->setDescription($productItems["description"] ?? '')
            ->setActive(!empty($productItems["active"]) && $productItems["active"] === "true")
            ->setPrice($productItems["price"] ?? '');

        $errors = $this->validator->validate($product);    

        if (count($errors) > 0) {
            return ["type" => "error", "message" => $errors[0]->getMessage()];
        }

        $product->setTitle($title = u($product->getTitle())->trim()->title()->toString());
    
        if (empty($productItems['categoryId']) || !($category = $this->categoryRepository->find($productItems['categoryId']))) {
            return ["type" => "error", "message" => "Category not found !"];
        }

        $product->setProductCategory($category);

        if (!$image && !$oldProd) {
            return ["type" => "error", "message" => "Image must have at most 2MB and must be jpeg, png or webp"];
        }
        
        if ($image) {
            if ($image->getSize() > (2 * 1024 * 1024) || !in_array($image->getMimeType(), ['image/jpeg', 'image/png', 'image/webp'])) {
              return ["type" => "error", "message" => "Image must have at most 2MB and must be jpeg, png or webp"];
            }

            try {
                $newFilename = uniqid() . '.' . $image->guessExtension();

                $image->move($defaultDir, $newFilename);

                $product->setImage($newFilename);
            } catch (\Throwable) {
                return ["type" => "error", "message" => "Error uploading the image"];
            }

            if ($oldImage && file_exists($defaultDir . '/' . $oldImage)) {
                unlink($defaultDir . '/' . $oldImage);
            }
        }

        if (!$oldProd && $this->productRepository->exists($title, $category, $user)) {
            return ["type" => "error", "message" => "You already have a product with the same name"];
        }        

        $this->productRepository->save(
            $product
                ->setCreatedAt($oldProd ? $product->getCreatedAt() : (new \DateTime()))
                ->setUpdatedAt($oldProd ? (new \DateTime()): null)
        );
       
        return ["type" => "success", "message" => "Product created"];
    }

    public function getCategories(): array
    {
        
        return $this->cache->get('category_list', function (ItemInterface $item) {
            $item->expiresAfter(14400);
            $categoryArr = $this->categoryRepository->findAll();

            if (empty($categoryArr)) {
                return [];
            }

            $cArr = [];

            foreach ($categoryArr as $category) {
                $cArr[] = ["name" => $category->getName(), "id" => $category->getId()];
            }

            return $cArr;
        });
    }

    public function getProductImage(string $fileName): ?string
    {
        $defaultDir = $this->parameterBag->get('kernel.project_dir') . '/public/uploads/products/';

        if (file_exists($defaultDir . $fileName)) {
            return $defaultDir . $fileName;
        }

        return null;
    }

    public function invalidateCache(): void
    {
        $this->cache->delete('category_list'); // clear cache
    }

    private function createOrderData(array $products, array $items): array 
    {
        $total = $quantity = 0;

        $sellerContainer = [];

        foreach ($items as $item) {
            if ($item["quantity"] < 1) {
                throw new \RuntimeException("Quantity can't be lower than 1");
            }

            $product = $products[$item["id"]];

            $pricePerProd = ($product->getPrice() * $item["quantity"]);

            $quantity += $item["quantity"];

            $total += $pricePerProd;

            $seller = $product->getOwner();

            if (!isset($sellerContainer[$seller->getId()])) {
                $sellerContainer[$seller->getId()] = [
                    "items" => [
                        $product->getId() => [
                            "product" => $product,
                            "quantity" => $item["quantity"]
                        ]
                    ],
                    "total" => $pricePerProd,
                    "quantity" => $item["quantity"],
                    "seller" => $seller
                ];
            } else {
                $sellerContainer[$seller->getId()]["items"][$product->getId()] = [
                    "product" => $product,
                    "quantity" => $item["quantity"]
                ];
                $sellerContainer[$seller->getId()]["total"] += $pricePerProd;
                $sellerContainer[$seller->getId()]["quantity"] += $item["quantity"]; 
            }
        }

        return [$sellerContainer, $total];
    }

    private function getProductsValidatedParams(array $parameters): array 
    {
        $validate = [
            "orderBy" => "createdAt",
            "order" => "DESC",
            "limit" => !empty($parameters["limit"]) && filter_var($parameters["limit"], FILTER_VALIDATE_INT)
                ? (int) $parameters["limit"]
                : 20
        ];


        if (!empty($parameters["active"]) && in_array($parameters["active"], ['true', 'false'])) {
            $validate["active"] = true;
        }    

        if (!empty($parameters["categoryId"]) && ($category = $this->categoryRepository->find($parameters["categoryId"]))) {
            $validate["productCategory"] = $category;
    
        } 
    
        if (!empty($parameters["order"])) {
             $order = match ($parameters["order"]) {
                'name_asc' => ['title', 'ASC'],
                'name_desc' => ['title', 'DESC'],
                'price_asc' => ['price', 'ASC'],
                'price_desc' => ['price', 'DESC'],
                 default => ['createdAt', 'DESC']
            }; 

            $validate["orderBy"] = $order[0];
            $validate["order"] = $order[1];
        }

        if (!empty($parameters["search"])) {
            $validate["search"] = trim(strtolower(filter_var($parameters["search"], FILTER_SANITIZE_FULL_SPECIAL_CHARS)));
        }

        return $validate;
    }
}