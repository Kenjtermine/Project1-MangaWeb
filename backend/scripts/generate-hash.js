// Script để generate bcrypt hash cho password "123456"
const bcrypt = require('bcrypt');

const password = '123456';

(async () => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('\n========================================');
    console.log('🔐 Bcrypt Hash for password "123456":');
    console.log('========================================');
    console.log(hashedPassword);
    console.log('========================================\n');
    console.log('✅ Copy hash trên và paste vào data.sql');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
