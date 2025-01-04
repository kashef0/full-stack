import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://my_database_w7d1_user:Y00UpfQyYO55isIBX0aUKeSglEwQMlIX@dpg-cts0aajqf0us73dmub50-a.frankfurt-postgres.render.com/my_database_w7d1'
                },
            },
        });
    }
}
