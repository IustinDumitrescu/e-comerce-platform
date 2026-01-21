<?php

namespace App\Repository;

use App\Entity\SellerOrder;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SellerOrder>
 */
class SellerOrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SellerOrder::class);
    }

    public function getMyOrders(User $user, array $parameters): array
    {
      return $this->createQueryBuilder('o')
          ->where('o.seller = :owner')
          ->setParameter('owner', $user)
          ->setMaxResults($parameters["limit"])
          ->setFirstResult($parameters["limit"] * ($parameters["page"] - 1))
          ->orderBy('o.'. $parameters["orderBy"], $parameters["order"])
          ->getQuery()->getResult();
    }
}
