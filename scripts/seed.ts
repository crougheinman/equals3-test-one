import { db } from "../lib/db";
import { practitioners } from "../lib/schema";

async function seed() {
  console.log("Seeding practitioners...");

  const data = [
    { name: "Dr. Alex Rivera", specialism: "Botox", location: "London", tier: "premium" },
    { name: "Jane Smith", specialism: "Dermal Fillers", location: "Manchester", tier: "standard" },
    { name: "Dr. Sam Taylor", specialism: "Botox", location: "Birmingham", tier: "premium" },
    { name: "Elena Rossi", specialism: "Skin Peels", location: "London", tier: "standard" },
  ];

  for (const practitioner of data) {
    await db.insert(practitioners).values(practitioner);
  }

  console.log("Seeding complete!");
}

seed();