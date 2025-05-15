import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear database (for development)
  console.log('🧹 Cleaning database...');
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👤 Creating users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@looped.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.SUPERADMIN,
    },
  });

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@looped.com',
      password: userPassword,
      name: 'Sample Buyer',
      role: Role.BUYER,
    },
  });

  // Log created users
  console.log(`Created admin user: ${admin.email}`);
  console.log(`Created buyer user: ${buyer.email}`);

  // Create products
  console.log('🛍️ Creating products...');
  const products = [
    {
      name: 'Vintage Denim Jacket',
      description: 'Classic 90s denim jacket in excellent condition. Size L.',
      price: 5999, // $59.99
      cost: 2000,  // $20.00
      stock: 1,
      category: 'Outerwear',
      images: [
        'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
        'https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg'
      ],
    },
    {
      name: 'Retro Band T-Shirt',
      description: 'Original 80s concert tee, slight fading adds character. Size M.',
      price: 2499, // $24.99
      cost: 800,   // $8.00
      stock: 1,
      category: 'Tops',
      images: [
        'https://images.pexels.com/photos/9558598/pexels-photo-9558598.jpeg',
        'https://images.pexels.com/photos/9558760/pexels-photo-9558760.jpeg'
      ],
    },
    {
      name: 'High-Waisted Mom Jeans',
      description: 'Perfect condition vintage mom jeans. Size 28.',
      price: 4499, // $44.99
      cost: 1500,  // $15.00
      stock: 2,
      category: 'Bottoms',
      images: [
        'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg',
        'https://images.pexels.com/photos/6311478/pexels-photo-6311478.jpeg'
      ],
    },
    {
      name: 'Leather Crossbody Bag',
      description: 'Genuine leather with brass hardware. Minor wear adds character.',
      price: 3999, // $39.99
      cost: 1000,  // $10.00
      stock: 1,
      category: 'Accessories',
      images: [
        'https://images.pexels.com/photos/5234271/pexels-photo-5234271.jpeg',
        'https://images.pexels.com/photos/5234272/pexels-photo-5234272.jpeg'
      ],
    },
    {
      name: 'Chunky Platform Boots',
      description: 'Doc Marten style boots in great condition. Size 8 women\'s.',
      price: 6499, // $64.99
      cost: 2500,  // $25.00
      stock: 1,
      category: 'Footwear',
      images: [
        'https://images.pexels.com/photos/10187959/pexels-photo-10187959.jpeg',
        'https://images.pexels.com/photos/8378667/pexels-photo-8378667.jpeg'
      ],
    },
    {
      name: 'Oversized Wool Sweater',
      description: 'Cozy vintage wool blend in earthy green. Size XL.',
      price: 3499, // $34.99
      cost: 1200,  // $12.00
      stock: 1,
      category: 'Tops',
      images: [
        'https://images.pexels.com/photos/6774456/pexels-photo-6774456.jpeg',
        'https://images.pexels.com/photos/6774501/pexels-photo-6774501.jpeg'
      ],
    }
  ];

  // Create products and log audit
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product
    });

    // Create audit log entry for product creation
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Product',
        entityId: createdProduct.id,
        performedBy: admin.id,
      }
    });

    console.log(`Created product: ${createdProduct.name}`);
  }

  // Create a sample order
  console.log('📦 Creating sample order...');
  
  // Get the first two products for the order
  const orderProducts = await prisma.product.findMany({
    take: 2,
  });
  
  // Create order items and calculate total
  const orderItems = orderProducts.map(product => ({
    productId: product.id,
    quantity: 1,
    subtotal: product.price
  }));
  
  const orderTotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Create the order
  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      status: OrderStatus.PENDING,
      total: orderTotal,
      items: {
        create: orderItems
      }
    },
    include: {
      items: true
    }
  });
  
  // Log audit entry for order creation
  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entity: 'Order',
      entityId: order.id,
      performedBy: buyer.id,
    }
  });
  
  console.log(`Created order: ${order.id} with ${order.items.length} items`);
  
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });