<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\ProductCategory;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function save(Product $product): void 
    {
        $em = $this->getEntityManager();

        $em->persist($product);

        $em->flush();
    }

    public function exists(string $title, ProductCategory $category, User $owner) 
    {
        return $this->createQueryBuilder('p')
            ->where('p.owner = :owner')
            ->andWhere('p.productCategory = :category')
            ->andWhere('lower(p.title) = :title')
            ->setParameter('owner', $owner)
            ->setParameter('category', $category)
            ->setParameter('title', $title)
            ->setMaxResults(1)
            ->getQuery()->getOneOrNullResult();
    }

    public function getMyProducts(array $parameters, User $owner, int $page, int $limit): array 
    {
        $orderBy = !empty($parameters["orderBy"]) 
            ? filter_var($parameters["orderBy"], FILTER_SANITIZE_FULL_SPECIAL_CHARS)
            : 'createdAt';

        $order = !empty($parameters["order"]) && in_array(strtoupper($parameters["order"]), ["ASC", "DESC"]) 
            ? $parameters["order"]
            : 'DESC';  


        return $this->createQueryBuilder('p')
            ->select('p')
            ->where('p.owner = :owner')
            ->setParameter('owner', $owner)
            ->setMaxResults($limit)
            ->setFirstResult($limit * ($page - 1))
            ->orderBy('p.'. $orderBy, $order)
            ->getQuery()->getResult();
    }
}
