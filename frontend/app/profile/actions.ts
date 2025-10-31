"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Provide a valid email address")
});

export async function updateProfileAction(values: z.infer<typeof profileSchema>) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    throw parsed.error;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email
    }
  });

  revalidatePath("/profile");

  return { success: true };
}
