import { authenticate } from "../shopify.server";
import { json } from "@react-router/node";
import { prisma } from "../db.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const complaints = await prisma.complaint.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
  });

  // Count complaints by status
  const pendingCount = await prisma.complaint.count({
    where: { shop, status: "pending" },
  });

  const inProgressCount = await prisma.complaint.count({
    where: { shop, status: "in_progress" },
  });

  const expiringCount = await prisma.complaint.count({
    where: { 
      shop, 
      status: { in: ["pending", "in_progress"] },
      dueDate: {
        lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Next 3 days
      }
    },
  });

  const respondedCount = await prisma.complaint.count({
    where: { shop, status: "responded" },
  });

  const completedCount = await prisma.complaint.count({
    where: { shop, status: "completed" },
  });

  return json({
    complaints,
    counts: {
      pending: pendingCount,
      inProgress: inProgressCount,
      expiring: expiringCount,
      responded: respondedCount,
      completed: completedCount,
    },
  });
}
