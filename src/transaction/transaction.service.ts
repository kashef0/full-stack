import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';



@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    dto: CreateTransactionDto, req: any

  ) {
    const {itemId, soldQty, price, itemTitle} = dto;

    const item = await this.prisma.item.findUnique({
        where: {
            id: itemId,
        },
    });
    if (!item) {
        throw new Error('item not found');
    }
    if(item.quantity < soldQty) {
        throw new Error('Not enouph items');
    }
    console.log('beforequintiy>', Number(item.quantity))
    const salerName = req.firstName + ' ' + req.lastName;

    const transaction = await this.prisma.transaction.create({
        data: {
            itemId,
            itemTitle,
            price,
            beforeQty: item.quantity,
            soldQty,
            salerName,
            
        },
    });
    await this.prisma.item.update({
        where: {id: itemId},
        data: {quantity: item.quantity - soldQty},
    });

    return transaction;
  }

  async getUserTransaction(userId: any) {
    console.log('User ID:', userId.id);

    const userTransaction = this.prisma.transaction.findMany({
        where: {
            item: {
                userId: userId.id,
            },
        },
    });
    return userTransaction;
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany();
  }
}
