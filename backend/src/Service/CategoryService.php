<?php

namespace App\Service;

use App\Repository\ProductCategoryRepository;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class CategoryService
{
    public function __construct(
        private readonly CacheInterface $cache,
        private readonly ProductCategoryRepository $categoryRepository
    )
    {
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