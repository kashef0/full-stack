import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { Prisma } from '@prisma/client';

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

      // Hämta artikeln med det angivna itemId
      const item =
        await this.prisma.item.findUnique({
          where: {
            id: itemId,
          },
        });

      // Om artikeln inte finns, kasta ett fel
      if (!item) {
        throw new ForbiddenException(
          'Ingen artikel hittades',
        );
      }

      // Kontrollera om det finns tillräckligt med artiklar på lager
      if (item.quantity < soldQty) {
        throw new ForbiddenException(
          'Inte tillräckligt med artiklar på lager',
        );
      }

      // Hämta säljarens namn från request
      const salerName =
        req.firstName + ' ' + req.lastName;

      // Hämta användarens ID från request
      const userId = parseInt(req.id);

      // Skapa en ny transaktion i databasen
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

      // Uppdatera artikeln med den nya mängden lager efter försäljning
      await this.prisma.item.update({
        where: { id: itemId },
        data: {
          quantity: item.quantity - soldQty, // Minska lager av den sålda mängden
        },
      });

      // Returnera den skapade transaktionen
      return transaction;
    } catch (error) {
      // Om ett fel uppstår, logga felet och hantera det
      console.error(
        'Det gick inte att skapa transaktionen:',
        error,
      );
    }
  }

  async getUserTransaction(userId: any) {
    try {
      // Kontrollera att användar ID är ett positivt heltal
      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        throw new ForbiddenException(
          'Ogiltigt användar-ID, det måste vara ett positivt nummer',
        );
      }

      // Kontrollera om användaren med det angivna ID existerar
      const existUser =
        await this.prisma.user.findUnique({
          where: { id: userId },
        });

      // Om användaren inte finns, kasta ett fel
      if (!existUser) {
        throw new ForbiddenException(
          `Ingen användare med angivna ID: ${userId}`,
        );
      }

      // Hämta alla transaktioner för den specifika användaren
      const userTransaction =
        await this.prisma.transaction.findMany({
          where: {
            item: {
              userId: userId,
            },
          },
        });

      // Returnera de hittade transaktionerna
      return userTransaction;
    } catch (error) {
      // Om ett fel uppstår vid hämtning av transaktionen, logga felet
      console.error(
        'Det gick inte att hämta transaktionen:',
        error,
      );
    }
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany();
  }

  async updateTransaction(
    transactionId: number,
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

      // Validera transactionId
      if (
        !Number(transactionId) ||
        transactionId <= 0
      ) {
        throw new ForbiddenException(
          `Transaction-id måste vara ett positivt tal`,
        );
      }

      // Kontrollera om transaktionen finns
      const existTransaction =
        await this.prisma.transaction.findUnique({
          where: { id: transactionId },
        });

      if (!existTransaction) {
        throw new ForbiddenException(
          `Hittades inte transaktion med angivna id: ${transactionId}`,
        );
      }

      // Kontrollera om artikeln finns
      const item =
        await this.prisma.item.findUnique({
          where: { id: itemId },
        });

      if (!item) {
        throw new ForbiddenException(
          'Ingen artikel hittades',
        );
      }

      // Validera att det finns tillräckligt med lager
      if (item.quantity < soldQty) {
        throw new ForbiddenException(
          'Inte tillräckligt med artiklar',
        );
      }

      const salerName =
        req.firstName + ' ' + req.lastName;
      const userId = parseInt(req.id);

      // Beräkna skillnaden i såld mängd
      const quantityDifference =
        existTransaction.soldQty - soldQty;

      // Uppdatera transaktionen med de nya värdena
      const updateTransaction =
        await this.prisma.transaction.update({
          where: { id: transactionId },
          data: {
            itemId,
            itemTitle,
            userId,
            price,
            beforeQty: item.quantity, // Uppdatera beforeQty med aktuell artikelmängd
            soldQty, // Uppdatera soldQty med den nya mängden
            salerName,
          },
        });

      // Uppdatera artikeln med den nya mängden
      // Om den nya soldQty är mindre behöver vi lägga till skillnaden tillbaka till artikelns mängd
      const newItemQuantity =
        item.quantity + quantityDifference;

      await this.prisma.item.update({
        where: { id: itemId },
        data: {
          quantity: newItemQuantity, // Uppdatera artikelns mängd med det nya värdet
        },
      });

      return updateTransaction;
    } catch (error) {
      console.error(
        'Det gick inte att hämta transaktionen:',
        error,
      );
      throw new InternalServerErrorException(
        'Ett fel uppstod när transaktionen skulle uppdateras',
      );
    }
  }

  async deleteTransaction(transactionId: number) {
    try {
      // Kontrollera om transaktions ID är ett positivt heltal
      if (
        !Number(transactionId) ||
        transactionId <= 0
      ) {
        throw new ForbiddenException(
          'Transaktions-ID måste vara ett positivt tal',
        );
      }

      // Försök hämta transaktionen från databasen med det angivna ID
      const getTransaction =
        await this.prisma.transaction.findUnique({
          where: { id: transactionId },
        });

      // Om transaktionen inte existerar
      if (!getTransaction) {
        throw new ForbiddenException(
          `Ingen transaktion med angivna ID: ${transactionId} hittades`,
        );
      }

      // Om transaktionen finns, fortsätt och ta bort den från databasen
      const deleteTransaction =
        await this.prisma.transaction.delete({
          where: { id: transactionId },
        });

      // Returnera den borttagna transaktionen
      return deleteTransaction;
    } catch (error) {
      // Logga eventuella fel som uppstår
      console.error(
        'Det gick inte att hämta transaktionen:',
        error,
      );

      // Om något går fel under processen kasta ett internt serverfel
      throw new InternalServerErrorException(
        'Ett fel uppstod när transaktionen skulle raderas',
      );
    }
  }
}
