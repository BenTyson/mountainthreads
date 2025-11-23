import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user with hashed password
  const hashedPassword = await bcrypt.hash("threads", 12);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@mountainthreads.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@mountainthreads.com",
      password: hashedPassword,
      name: "Admin",
    },
  });
  console.log("✅ Admin user created:", admin.email);
  console.log("   Default password: threads");

  // Create test groups
  const group1 = await prisma.group.upsert({
    where: { slug: "tyson-family" },
    update: {},
    create: {
      name: "Tyson Family",
      slug: "tyson-family",
      emails: ["john@example.com", "jane@example.com"],
      notes: "Family of 4, first time renters. Need beginner equipment.",
    },
  });
  console.log("✅ Group created:", group1.name);

  const group2 = await prisma.group.upsert({
    where: { slug: "smith-group" },
    update: {},
    create: {
      name: "Smith Group",
      slug: "smith-group",
      emails: ["mike@example.com", "sarah@example.com", "tom@example.com"],
      paid: true,
      notes: "Corporate retreat group. 3 adults, intermediate level.",
    },
  });
  console.log("✅ Group created:", group2.name);

  const group3 = await prisma.group.upsert({
    where: { slug: "johnson-party" },
    update: {},
    create: {
      name: "Johnson Party",
      slug: "johnson-party",
      emails: ["alex@example.com"],
      paid: true,
      pickedUp: true,
      returned: true,
      archived: true,
      notes: "Completed rental. All equipment returned in good condition.",
    },
  });
  console.log("✅ Group created:", group3.name, "(archived)");

  // Create test form submissions for group1
  const submission1 = await prisma.formSubmission.create({
    data: {
      groupId: group1.id,
      email: "john@example.com",
      data: {
        firstName: "John",
        lastName: "Tyson",
        phone: "555-123-4567",
        experience: "beginner",
        shoeSize: "10",
        height: "5'10\"",
        weight: "175",
        needsHelmet: true,
        needsGoggles: true,
        familyMembers: [
          {
            firstName: "Emma",
            lastName: "Tyson",
            age: 12,
            shoeSize: "6",
            height: "4'8\"",
            weight: "85",
            experience: "beginner",
          },
        ],
      },
    },
  });
  console.log("✅ Form submission created for:", submission1.email);

  const submission2 = await prisma.formSubmission.create({
    data: {
      groupId: group1.id,
      email: "jane@example.com",
      data: {
        firstName: "Jane",
        lastName: "Tyson",
        phone: "555-123-4568",
        experience: "intermediate",
        shoeSize: "7",
        height: "5'6\"",
        weight: "140",
        needsHelmet: true,
        needsGoggles: false,
      },
    },
  });
  console.log("✅ Form submission created for:", submission2.email);

  // Create test form submissions for group2
  const submission3 = await prisma.formSubmission.create({
    data: {
      groupId: group2.id,
      email: "mike@example.com",
      data: {
        firstName: "Mike",
        lastName: "Smith",
        phone: "555-987-6543",
        experience: "intermediate",
        shoeSize: "11",
        height: "6'0\"",
        weight: "190",
        needsHelmet: false,
        needsGoggles: true,
      },
    },
  });
  console.log("✅ Form submission created for:", submission3.email);

  console.log("\n🎉 Seeding complete!");
  console.log("\nTest data summary:");
  console.log("- 1 admin user");
  console.log("- 3 groups (2 active, 1 archived)");
  console.log("- 3 form submissions");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
