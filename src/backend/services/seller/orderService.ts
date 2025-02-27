import { nanoid } from "nanoid"

import InvariantError from "@/backend/errors/InvariantError";
import NotFoundError from "@/backend/errors/NotFoundError";

import prisma from "@/backend/libs/prismadb"

import type { PaginationParams } from "@/types";
import { OrderStatus } from "@prisma/client";
import AuthorizationError from "@/backend/errors/AuthorizationError";


export const getOrders = async (sellerId: string, { page, itemCount }: PaginationParams) => {
  if (page < 1 || itemCount < 1) {
    throw new InvariantError("Page dan itemcount tidak boleh kurang dari 1");
  }

  const orders = await prisma.itemOrder.findMany({
    skip: itemCount * (page - 1),
    take: itemCount,
    where: {
      sellerId,
      itemOrderStatus: {
        some: {
          status: OrderStatus.SELLER_VERIFICATION,
        },
      },
    },
    // select: {

    // }
  });

  return orders;
}

export const getOrderById = async (sellerId: string, orderId: string) => {
  const order = await prisma.itemOrder.findFirst({
    where: {
      id: orderId,
    },
    // select: {

    // }
  });

  if (!order) {
    throw new NotFoundError("Order tidak ditemukan");
  }

  if (order.sellerId !== sellerId) {
    throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }

  return order;
}

export const updateOrderStatus = async (sellerId: string, orderId: string, status: OrderStatus) => {
  const order = await prisma.itemOrder.findFirst({
    where: {
      id: orderId,
    },
    select: {
      sellerId: true,
      id: true,
      title: true,
      itemOrderStatus: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundError("Order tidak ditemukan");
  }

  if (order.sellerId !== sellerId) {
    throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }

  if (order.itemOrderStatus.some(({status: orderStats}) => orderStats === status)) {
    throw new InvariantError(`Item telah ${status} sebelumnya`);
  }

  const verify = await prisma.itemOrderStatus.create({
    data: {
      id: `itemOrderStatus-${nanoid(16)}`,
      itemOrderId: order.id,
      status,
    },
    select: {
      id: true,
    },
  });

  if (!verify) {
    throw new InvariantError("Terjadi kesalahan");
  }

  return order.id;
}
