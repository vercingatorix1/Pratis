import { PrismaClient } from "@prisma/client";
import { users, organization } from "./seed_data";

const prisma = new PrismaClient();

const seedOrganization = async () => {
  try {
    await prisma.organization.create({ data: organization });
    console.log("Seeded organization");
  } catch (error) {
    console.log("Error while seeding organization");
    console.log(error);
  }
};

const seedEmployees = async () => {
  try {
    let org = await prisma.organization.findFirst();
    users.forEach(async (u) => {
      await prisma.employee.create({
        data: {
          isProjectManager: u.firstName === "Bruce",
          orgId: org!.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
        },
      });
    });
    console.log("Seeded Employees");
  } catch (error) {
    console.log("Error while seeding employees");
    console.log(error);
  }
};

const seedProject = async () => {
  try {
    let pm = await prisma.employee.findFirst({
      where: {
        isProjectManager: true,
      },
    });
    let org = await prisma.organization.findFirst();
    await prisma.project.create({
      data: {
        description: "Batmobile",
        startDate: new Date(),
        endDate: new Date(),
        projectManagerId: pm!.id,
        orgId: org!.id,
      },
    });
    console.log("Seeded project");
  } catch (error) {
    console.log("Error while seeding project");
    console.log(error);
  }
};

const seedFeatures = async () => {
  try {
    let project = await prisma.project.findFirst();
    await prisma.feature.createMany({
      data: [
        {
          description: "Assault weapons",
          startDate: new Date(),
          endDate: new Date(),
          projectId: project!.id,
          featurePriority: 1,
        },
        {
          description: "Defence shield",
          startDate: new Date(),
          endDate: new Date(),
          projectId: project!.id,
          featurePriority: 2,
        },
      ],
    });

    console.log("Seeded features");
  } catch (error) {
    console.log("Error while seeding features");
    console.log(error);
  }
};

const seedActivities = async () => {
  try {
    let allEmployees = await prisma.employee.findMany();
    let allFeatures = await prisma.feature.findMany();
    let project = await prisma.project.findFirst();

    await prisma.activity.createMany({
      data: [
        {
          description: "Put assault rifle in front",
          startDate: new Date(),
          endDate: new Date(),
          activityPriority: 1,
          employeeId: allEmployees[0].id,
          featureId: allFeatures[0].id,
          projectId: project!.id,
        },
        {
          description: "Put machine gun at the back",
          startDate: new Date(),
          endDate: new Date(),
          activityPriority: 2,
          employeeId: allEmployees[1].id,
          featureId: allFeatures[0].id,
          projectId: project!.id,
        },
        {
          description: "Carbon fiber coating",
          startDate: new Date(),
          endDate: new Date(),
          activityPriority: 3,
          employeeId: allEmployees[2].id,
          featureId: allFeatures[1].id,
          projectId: project!.id,
        },
        {
          description: "Smoke grenade",
          startDate: new Date(),
          endDate: new Date(),
          activityPriority: 4,
          employeeId: allEmployees[3].id,
          featureId: allFeatures[1].id,
          projectId: project!.id,
        },
        {
          description: "Independent activity",
          startDate: new Date(),
          endDate: new Date(),
          activityPriority: 5,
          employeeId: allEmployees[3].id,
          projectId: project!.id,
        },
      ],
    });
    console.log("Seeded activites");
  } catch (error) {
    console.log("Error while seeding activities");
    console.log(error);
  }
};

const main = async () => {
  // await seedOrganization();
  // await seedEmployees();
  await seedProject();
  await seedFeatures();
  await seedActivities();
};

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
