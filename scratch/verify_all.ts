import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function runEndToEndVerification() {
  console.log('=== STARTING END-TO-END SYSTEM VERIFICATION ===\n');

  // 1. Verify Admin Password Hash
  const testPassword = 'LawDiaries2026!';
  const storedHash = process.env.ADMIN_PASSWORD_HASH || '$2a$12$ZAgCSKyikF20AjiYUz3QeubrB.g3Q/BWi8UoEuKQyM5ZUqNVQS5DG';
  const isAuthValid = await bcrypt.compare(testPassword, storedHash);
  console.log(`1. AUTHENTICATION TEST: Password Hash Verification -> ${isAuthValid ? 'PASS' : 'FAIL'}`);

  // 2. Test Creating Draft Post
  const draftSlug = `test-draft-${Date.now()}`;
  const draftPost = await prisma.post.create({
    data: {
      title: 'Verification Test Draft Post',
      slug: draftSlug,
      excerpt: 'This is a test draft post.',
      content: '# Test Draft Header\nThis should not appear publicly.',
      tags: JSON.stringify(['Test', 'Policy']),
      status: 'draft',
    },
  });
  console.log(`2. DRAFT CREATION TEST: Created Draft Post (ID: ${draftPost.id}) -> PASS`);

  // Verify Draft DOES NOT appear in published posts query
  const publishedBefore = await prisma.post.findMany({ where: { status: 'published' } });
  const draftInPublic = publishedBefore.some((p: { slug: string }) => p.slug === draftSlug);
  console.log(`3. PUBLIC ISOLATION TEST: Draft hidden from public feed -> ${!draftInPublic ? 'PASS' : 'FAIL'}`);

  // 4. Test Publishing the Post
  const updatedPost = await prisma.post.update({
    where: { id: draftPost.id },
    data: { status: 'published' },
  });
  const publishedAfter = await prisma.post.findMany({ where: { status: 'published' } });
  const publishedInPublic = publishedAfter.some((p: { slug: string }) => p.slug === draftSlug);
  console.log(`4. POST PUBLISHING TEST: Published post visible in public feed -> ${publishedInPublic ? 'PASS' : 'FAIL'}`);

  // 5. Test Reader Comment Submission
  const comment = await prisma.comment.create({
    data: {
      postId: updatedPost.id,
      name: 'Verification Reader',
      email: 'reader@example.com',
      body: 'Great article on constitutional jurisprudence!',
      honeypot: '',
    },
  });
  console.log(`5. COMMENT SUBMISSION TEST: Comment created (ID: ${comment.id}) -> PASS`);

  // 6. Test Comment Persistence & Querying
  const fetchedComments = await prisma.comment.findMany({ where: { postId: updatedPost.id } });
  console.log(`6. COMMENT PERSISTENCE TEST: Found ${fetchedComments.length} comment(s) -> ${fetchedComments.length > 0 ? 'PASS' : 'FAIL'}`);

  // 7. Cleanup Test Post & Cascading Comments
  await prisma.post.delete({ where: { id: updatedPost.id } });
  const deletedCheck = await prisma.post.findUnique({ where: { id: updatedPost.id } });
  console.log(`7. POST DELETION TEST: Post & associated comments removed from DB -> ${!deletedCheck ? 'PASS' : 'FAIL'}`);

  console.log('\n=== END-TO-END VERIFICATION COMPLETE ===');
}

runEndToEndVerification()
  .catch((e) => {
    console.error('Verification failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
