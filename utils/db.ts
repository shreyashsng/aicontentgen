import { db } from '@/db';
import { users, subscriptions, generatedContent } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export async function createOrUpdateUser(id: string, email: string) {
  const [user] = await db
    .insert(users)
    .values({ id, email })
    .onConflictDoUpdate({
      target: users.id,
      set: { email, updatedAt: new Date() },
    })
    .returning();

  // Create unlimited subscription for new users
  await db
    .insert(subscriptions)
    .values({
      id: createId(),
      userId: id,
      status: 'active',
      plan: 'unlimited',
    })
    .onConflictDoNothing();

  return user;
}

export async function saveGeneratedContent(
  userId: string,
  prompt: string,
  platform: 'instagram' | 'twitter',
  captions: string[]
) {
  return await db.insert(generatedContent).values({
    id: createId(),
    userId,
    prompt,
    platform,
    captions,
  });
}

export async function getUserHistory(userId: string) {
  return await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.userId, userId))
    .orderBy(desc(generatedContent.createdAt));
}

export async function getUserSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  
  return subscription;
} 