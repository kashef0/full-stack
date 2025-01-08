import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';



@Controller('transaction')
@UseGuards(JwtGuard)
export class TransactionController {
    constructor(private transactionService: TransactionService) {}

    @Post()
    createTransaction(@Body() dto: CreateTransactionDto, @GetUser() req) {
        return this.transactionService.createTransaction(dto, req);
    }

    @Get('me')
    getUserTransactions(@GetUser() userId) {
        return this.transactionService.getUserTransaction(userId);
    }

    @Get()
    @UseGuards(JwtGuard)
    getAllTransactions() {
        return this.transactionService.getAllTransactions();
    }

}
