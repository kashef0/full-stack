import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/auth/rolesGuard';



@Controller('transaction')
@UseGuards(JwtGuard)
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Post('create')
    createTransaction(@Body() dto: CreateTransactionDto, @GetUser() req) {
        return this.transactionService.createTransaction(dto, req);
    }

    @Get('getTransaction/:id')
    getUserTransactions(@Param('id') userId: number) {
        return this.transactionService.getUserTransaction(userId);
    }

    @Patch('update/:id')
    @UseGuards(RolesGuard)
    updateTransaction(
        @Param('id') transactionId: number,
        @Body() dto: CreateTransactionDto,
        @GetUser() req: any
    ) {
        return this.transactionService.updateTransaction(transactionId, dto, req);
    }

    @Delete('delete/:id')
    @UseGuards(RolesGuard)
    deleteTransaction(@Param('id') transactionId: number) {
        return this.transactionService.deleteTransaction(transactionId);
    }

    @Get()
    @UseGuards(JwtGuard)
    getAllTransactions() {
        return this.transactionService.getAllTransactions();
    }

}
