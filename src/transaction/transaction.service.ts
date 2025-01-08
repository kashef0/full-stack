import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    dto: CreateTransactionDto,
    req: any,
  ) {
    try {
      const {
        itemId,
        soldQty,
        price,
        itemTitle,
      } = dto;

      const item =
        await this.prisma.item.findUnique({
          where: {
            id: itemId,
          },
        });
      if (!item) {
        throw new ForbiddenException(
          'ingen item hittades',
        );
      }
      if (item.quantity < soldQty) {
        throw new ForbiddenException(
          'Inte tillräckligt med item',
        );
      }
      const salerName =
        req.firstName + ' ' + req.lastName;

      const userId = parseInt(req.id);
      const transaction =
        await this.prisma.transaction.create({
          data: {
            itemId,
            itemTitle,
            userId,
            price,
            beforeQty: item.quantity,
            soldQty,
            salerName,
          } as Prisma.TransactionUncheckedCreateInput,
        });
      await this.prisma.item.update({
        where: { id: itemId },
        data: {
          quantity: item.quantity - soldQty,
        },
      });

      return transaction;
    } catch (error) {
      console.error('Det gick inte att skapa transaktionen:', error);
    }
  }

  async getUserTransaction(userId: any) {

    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new ForbiddenException('ogitligt användare id, det måste vara ett positivt nummer');
      }
  
      const existUser = await this.prisma.user.findUnique({
        where: {id: userId},
      });
  
      if (!existUser) {
        throw new ForbiddenException(`ingen användare med angivna id: ${userId}`);
      }
      const userTransaction =
      this.prisma.transaction.findMany({
        where: {
          item: {
            userId: userId.id,
          },
        },
      });
    return userTransaction;

    } catch (error) {
      console.error('Det gick inte att hämta transaktionen:', error);
    }
    
  }


  async getAllTransactions() {
    return this.prisma.transaction.findMany();
  }


  async updateTransaction(transactionId: number, dto: CreateTransactionDto, req: any) {
    try {
      const {
        itemId,
        soldQty,
        price,
        itemTitle,
      } = dto;
  
      // Validate the transactionId
      if (!Number(transactionId) || transactionId <= 0) {
        throw new ForbiddenException(`transaction id måste vara ett positivt tal`);
      }
  
      // Check if the transaction exists
      const existTransaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
      });
  
      if (!existTransaction) {
        throw new ForbiddenException(`Hittades inte transaktion med angivna id: ${transactionId}`);
      }
  
      // Check if the item exists
      const item = await this.prisma.item.findUnique({
        where: { id: itemId },
      });
  
      if (!item) {
        throw new ForbiddenException('ingen item hittades');
      }
  
      // Validate that there is enough stock
      if (item.quantity < soldQty) {
        throw new ForbiddenException('Inte tillräckligt med item');
      }
  
      const salerName = req.firstName + ' ' + req.lastName;
      const userId = parseInt(req.id);
  
      // Calculate the difference in sold quantity
      const quantityDifference = existTransaction.soldQty - soldQty;
  
      // Update the transaction with new values
      const updateTransaction = await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          itemId,
          itemTitle,
          userId,
          price,
          beforeQty: item.quantity, // Update the beforeQty with the current item quantity
          soldQty, // Update the soldQty with the new quantity
          salerName,
        },
      });
  
      // Update the item's quantity
      // If the new soldQty is smaller, you need to add the difference back to the item quantity
      const newItemQuantity = item.quantity + quantityDifference;
  
      await this.prisma.item.update({
        where: { id: itemId },
        data: {
          quantity: newItemQuantity, // Update the item quantity with the new value
        },
      });
  
      return updateTransaction;
    } catch (error) {
      console.error('Det gick inte att hämta transaktionen:', error);
      throw new InternalServerErrorException('Ett fel uppstod när transaktionen skulle uppdateras');
    }
  }

  async deleteTransaction(transactionId: number) {
    try {

      const getTransaction = await this.prisma.transaction.findUnique({
        where: {id: transactionId},
      });

      if (!Number(transactionId) || transactionId <= 0 ) {
        throw new ForbiddenException('transaktion id måste vara ett positiv tal');
      }

      if (!getTransaction) {
        throw new ForbiddenException(`ingen transaktion med angivna id: ${transactionId} hittades`);
      }

      const deleteTransaction = await this.prisma.transaction.delete({
        where: {id: transactionId},
      });
      return deleteTransaction;
      
    } catch (error) {
      console.error('Det gick inte att hämta transaktionen:', error);
      throw new InternalServerErrorException('Ett fel uppstod när transaktionen skulle raderas');
    }
  }
  
}
