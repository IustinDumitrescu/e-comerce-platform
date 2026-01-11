<?php

namespace App\Service;

use App\Entity\Product;
use App\Entity\User;
use App\Repository\ProductCategoryRepository;
use App\Repository\ProductRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
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
        private readonly ProductRepository $productRepository
    )
    {
    }

    public function createProduct(User $user, array $productItems, ?UploadedFile $image): array 
    {
        $defaultDir = $this->parameterBag->get('kernel.project_dir') . '/public/uploads/products'; ;

        $product = new Product();
        
        $product
            ->setOwner($user)
            ->setTitle($productItems["name"] ?? '')
            ->setDescription($productItems["description"] ?? '')
            ->setActive($productItems["active"] ?? true)
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

        if (!$image) {
            return ["type" => "error", "message" => "No image found"];
        }
        
        try {
            $newFilename = uniqid() . '.' . $image->guessExtension();

            $image->move($defaultDir, $newFilename);

            $product->setImage($newFilename);
        } catch (\Throwable) {
            return ["type" => "error", "message" => "Error uploading the image"];
        }

        if ($this->productRepository->exists($title, $category, $user)) {
            return ["type" => "error", "message" => "You already have a product with the same name"];
        }        

        $this->productRepository->save(
            $product
                ->setCreatedAt((new \DateTime()))
                ->setUpdatedAt((new \DateTime()))
        );
       
        return ["type" => "success", "message" => "Product created"];
    }

    public function getCategories(): array
    {
        $this->invalidateCache();

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

    public function invalidateCache(): void
    {
        $this->cache->delete('category_list'); // clear cache
    }
}