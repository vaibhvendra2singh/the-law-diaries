import { getPagesData } from '../lib/pagesStore';
import { prisma } from '../lib/prisma';

async function runEmpiricalAudit() {
  console.log("=== EMPIRICAL VERIFICATION AUDIT START ===");

  // 1. Check Pages Store (Static Pages Data)
  const pagesData = getPagesData();
  console.log("\n[1] Pages Store Content (content/pages.json):");
  console.log(JSON.stringify(pagesData, null, 2));

  // 2. Query Database for Published Posts
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'published' },
      select: { id: true, title: true, slug: true, authorName: true, authorBio: true, tags: true, date: true }
    });
    console.log(`\n[2] Database Query - Published Posts Count: ${posts.length}`);
    if (posts.length > 0) {
      console.log("Sample Post Record:", JSON.stringify(posts[0], null, 2));
    }
  } catch (err: any) {
    console.log("\n[2] Database Query Error:", err.message);
  }

  // 3. Query Database for Comments
  try {
    const commentsCount = await prisma.comment.count();
    console.log(`\n[3] Database Query - Total Comments Count: ${commentsCount}`);
  } catch (err: any) {
    console.log("\n[3] Database Comments Query Error:", err.message);
  }

  console.log("\n=== EMPIRICAL VERIFICATION AUDIT END ===");
}

runEmpiricalAudit()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
