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
    await tx.printerLabel.deleteMany();
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
      role: 'admin',
      pin: '1234'
    }
  });

  // KDS “kitchen admin” (hidden from KDS tabs; login name admin, PIN 1234) — see KdsPage KDS_ADMIN_CREDENTIAL_KITCHEN_ID
  await prisma.kitchen.create({
    data: {
      id: 'kitchen-kds-admin',
      name: 'admin',
      pin: '1234'
    }
  });

  await prisma.paymentMethod.createMany({
    data: [
      { name: 'Cash', integration: 'manual_cash', active: true, sortOrder: 0 },
      { name: 'Cashmatic', integration: 'cashmatic', active: true, sortOrder: 1 },
      { name: 'Card (Payworld)', integration: 'payworld', active: true, sortOrder: 2 },
      { name: 'Bancontact', integration: 'generic', active: true, sortOrder: 3 },
    ],
  });

  console.log(
    'Seed done: database cleared; admin user, KDS kitchen admin, and default payment methods (Cash, Cashmatic, Payworld, Bancontact, Visa).'
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
