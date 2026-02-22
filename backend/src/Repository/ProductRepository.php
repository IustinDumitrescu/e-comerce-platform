<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\ProductCategory;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
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

    public function countByParamaters(array $parameters): int
    {
         $qb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)');

        $this->addProductsQueryParameters($qb, $parameters);

        return $qb->getQuery()->getSingleScalarResult();
    }

    public function findByParameters(
        array $parameters, 
        string $orderBy, 
        string $order, 
        int $page = 1, 
        int $limit = 20    
    ): array 
    {
        $qb = $this->createQueryBuilder('p');

        $this->addProductsQueryParameters($qb, $parameters);

        return $qb
            ->addSelect('PARTIAL c.{id, name}')
            ->leftJoin('p.productCategory', 'c')
            ->orderBy('p.' . $orderBy, $order)
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()->getResult();
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

    public function getMyProducts(array $parameters, User $owner): array 
    {
        $page = !empty($parameters["page"]) && filter_var($parameters["page"], FILTER_VALIDATE_INT)
            ? (int) $parameters["page"]
            : 1;

        $limit = !empty($parameters["limit"]) && in_array($parameters["limit"], [10 , 20, 30])   
            ? (int) $parameters["limit"]
            : 10;

        $orderBy = !empty($parameters["orderBy"]) 
            ? filter_var($parameters["orderBy"], FILTER_SANITIZE_FULL_SPECIAL_CHARS)
            : 'createdAt';

        $order = !empty($parameters["order"]) && in_array(strtoupper($parameters["order"]), ["ASC", "DESC"]) 
            ? $parameters["order"]
            : 'DESC';  

        return $this->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.productCategory', 'c')
            ->addSelect('PARTIAL c.{id, name}')
            ->where('p.owner = :owner')
            ->setParameter('owner', $owner)
            ->setMaxResults($limit)
            ->setFirstResult($limit * ($page - 1))
            ->orderBy('p.'. $orderBy, $order)
            ->getQuery()->getResult();
    }

    public function findByIdList(array $productIds): array 
    {
        return $this->createQueryBuilder('p')
            ->where('p.id in (:ids)')
            ->setParameter('ids', $productIds)
            ->getQuery()
            ->getResult();   
    }

    private function addProductsQueryParameters(QueryBuilder $qb, array $parameters): void
    {
        if (!empty($parameters["search"])) {
            $search = $parameters['search'];

            $qb->andWhere("lower(p.title) like CONCAT('%', '$search', '%')");
        }

        foreach ($parameters as $key => $parameter) {
            if (!in_array($key, ['limit', 'order', 'orderBy', 'search'])) {
                $qb
                    ->andWhere("p.$key = :$key")
                    ->setParameter($key, $parameter);
            }
        }
    }
}
