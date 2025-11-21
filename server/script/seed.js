require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const sequelize = require("../config/database");

const seedUsers = [
  {
    username: "fktp-admin",
    password: "admin123",
    role: "FKTP",
  },
  {
    username: "bpjs-admin",
    password: "admin123",
    role: "BPJS",
  },
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi DB berhasil!");

    await User.destroy({ where: {} });
    console.log("🗑️ Data users lama dihapus.");

    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.bulkCreate(hashedUsers, { validate: true });
    console.log("✅ Seeder selesai! User default ditambahkan:");
    seedUsers.forEach((u) =>
      console.log(`  - ${u.username} (${u.role}) - Password: ${u.password}`)
    );

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error saat seeding:", error.message);
    process.exit(1);
  }
}

seedDatabase();
