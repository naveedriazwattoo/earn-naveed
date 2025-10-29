import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test user address
    const testUser = '0x58ae5b1f610452dd3a17c14b2cdb90861aee91ff';
    
    console.log('Testing badges endpoint...');
    
    // First, try to fetch badges
    const response = await fetch(`http://localhost:3000/api/badges?user=${testUser}`);
    const data = await response.json();
    
    console.log('Response:', data);
    
    // Then, check the database directly
    const dbBadges = await prisma.userBadges.findUnique({
      where: { user: testUser }
    });
    
    console.log('Database entry:', dbBadges);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 