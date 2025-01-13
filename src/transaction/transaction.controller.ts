import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/auth/rolesGuard';



@Controller('transaction')
@UseGuards(JwtGuard)
export class TransactionController {
    // Injectera TransactionService för att interagera med logiken
    constructor(private transactionService: TransactionService) {}

    // Skapa en ny transaktion
    @Post('create')
    createTransaction(@Body() dto: CreateTransactionDto, @GetUser() req) {
    // Anropa tjänsten för att skapa en transaktion och returnera svaret
    return this.transactionService.createTransaction(dto, req);
    }

    // Hämta alla transaktioner för en användare baserat på användar-ID
    @Get('getTransaction/:id')
    getUserTransactions(@Param('id') userId: number) {
    // Anropa tjänsten för att hämta transaktioner för den specifika användaren
    return this.transactionService.getUserTransaction(userId);
    }

    // Uppdatera en specifik transaktion
    @Put('update/:id')
    @UseGuards(RolesGuard)  // Skydda denna route med en roles guard admin
    updateTransaction(
    @Param('id') transactionId: number,  // Transaktions-ID som ska uppdateras
    @Body() dto: CreateTransactionDto,  // Data för att uppdatera transaktionen
    @GetUser() req: any  // Hämta användarinformation från requesten
    ) {
    // Anropa tjänsten för att uppdatera transaktionen och returnera svaret
    return this.transactionService.updateTransaction(transactionId, dto, req);
    }

    // Ta bort en specifik transaktion
    @Delete('delete/:id')
    @UseGuards(RolesGuard)  // Skydda denna route med en roles guard
    deleteTransaction(@Param('id') transactionId: number) {
    // Anropa tjänsten för att ta bort transaktionen och returnera svaret
    return this.transactionService.deleteTransaction(transactionId);
    }

    // Hämta alla transaktioner (endast för användare med giltig JWT)
    @Get()
    @UseGuards(JwtGuard)  // Skydda denna route med en JWT-guard för autentisering
    getAllTransactions() {
    // Anropa tjänsten för att hämta alla transaktioner och returnera svaret
    return this.transactionService.getAllTransactions();
    }
}
