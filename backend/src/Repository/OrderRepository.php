<?php

namespace App\Repository;

use App\Entity\Order;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Order>
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

   public function getEntityManager(): EntityManagerInterface
   {
        return parent::getEntityManager();
   }

   public function getMyOrders(User $user, array $parameters): array
   {
      return $this->createQueryBuilder('o')
          ->select('o')
          ->where('o.buyer = :owner')
          ->setParameter('owner', $user)
          ->setMaxResults($parameters["limit"])
          ->setFirstResult($parameters["limit"] * ($parameters["page"] - 1))
          ->orderBy('o.'. $parameters["orderBy"], $parameters["order"])
          ->getQuery()->getResult();
   }
}
