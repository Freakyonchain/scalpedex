import { prisma } from '@/lib/db'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function syncClerkUser(event: WebhookEvent) {
  switch (event.type) {
    case 'user.created':
      await createClerkUser(event.data)
      break
    case 'user.deleted':
      await deleteClerkUser(event.data)
      break
  }
}

async function createClerkUser(userData: any) {
  const { id, email_addresses, username } = userData

  await prisma.clerkUser.create({
    data: {
      id,
      email: email_addresses[0]?.email_address,
      username: username || email_addresses[0]?.email_address.split('@')[0]
    }
  })
}

async function deleteClerkUser(userData: any) {
  const { id } = userData

  await prisma.clerkUser.delete({
    where: { id }
  })
}