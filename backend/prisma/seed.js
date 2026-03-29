import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.orderPayment.deleteMany();
    await tx.orderItem.deleteMany();
    await tx.order.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.subproduct.deleteMany();
    await tx.subproductGroup.deleteMany();
    await tx.table.deleteMany();
    await tx.room.deleteMany();
    await tx.customer.deleteMany();
    await tx.user.deleteMany();
    await tx.kitchen.deleteMany();
    await tx.discount.deleteMany();
    await tx.paymentMethod.deleteMany();
    await tx.paymentTerminal.deleteMany();
    await tx.appSetting.deleteMany();
    await tx.printer.deleteMany();
    await tx.priceGroup.deleteMany();
  });

  await prisma.user.create({
    data: {
      id: 'admin',
      name: 'Admin',
      role: 'waiter',
      pin: '1234'
    }
  });

  console.log('Seed done: database cleared; only admin (admin) created.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
