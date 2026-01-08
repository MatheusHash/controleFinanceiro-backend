import { Controller, Post, Body, Res } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import type { Request, Response } from 'express';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async create(@Body() createBillDto: CreateBillDto, @Res() res: Response) {
    const { data, status } = await this.billsService.create(createBillDto);

    return res.json(data).status(status).end();
  }
}
