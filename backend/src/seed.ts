import { prisma } from "./prisma.js";

async function main() {
  const existing = await prisma.survey.findFirst();
  if (existing) {
    console.log("Survey already exists, skipping seed.");
    return;
  }

  const survey = await prisma.survey.create({
    data: {
      title: "Survey App(Demo)",
      description: "Demographic, health, and financial questions to estimate care needs.",
      questions: {
        create: [
          {
            order: 1,
            title: "Full Name",
            description: "As shown on ID",
            type: "TEXT",
            required: true,
          },
          {
            order: 2,
            title: "Age",
            description: "Enter your age in years",
            type: "NUMBER",
            required: true,
          },         
          {
            order: 3,
            title: "Do you have any chronic conditions?",
            description: "List or type None",
            type: "TEXT",
            required: false,
          },
          {
            order: 4,
            title: "Annual Income (USD)",
            description: "Numbers only",
            type: "NUMBER",
            required: true,
          },
          {
            order: 5,
            title: "Primary Insurance",
            description: "Choose your primary coverage",
            type: "SELECT",
            options: JSON.stringify([
              "Private",
              "Medicare",
              "Medicaid",
              "None",
            ]), 
            required: true,
          },
        ],
      },
    },
    include: { questions: true },
  });

  console.log("Seeded survey with", survey.questions.length, "questions.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
