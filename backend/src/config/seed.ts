import prisma from './prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Delete all existing data
  console.log('🧹 Clearing existing data...');
  await prisma.notification.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.chatThread.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.recruitment.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✨ Database cleared.');

  // 2. Generate a single password hash for performance
  const passwordHash = await bcrypt.hash('password123', 10);

  // 3. Seed Users
  console.log('👤 Creating users...');
  const users = [];

  // 5 Players
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `player${i}@rosterx.com`,
        passwordHash,
        username: `player_${i}`,
        displayName: `Player ${i}`,
        role: 'player',
        emailVerified: true,
        bio: `Bio of player ${i}. Specialized in competitive FPS games.`,
        country: 'India',
        settings: {
          showOnlineStatus: true,
          allowDirectMessages: true,
          showInSearch: true,
          notificationPrefs: {
            applications: true,
            messages: true,
            teams: true,
            organizations: true,
            tournaments: true,
            platform: true,
            security: true,
            verification: true,
          },
        },
      },
    });
    users.push(user);
  }

  // 5 Organizers
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `organizer${i}@rosterx.com`,
        passwordHash,
        username: `organizer_${i}`,
        displayName: `Organizer ${i}`,
        role: 'organizer',
        emailVerified: true,
        bio: `Recruiter and organizer for esports franchise ${i}.`,
        country: 'India',
        settings: {
          showOnlineStatus: true,
          allowDirectMessages: true,
          showInSearch: true,
          notificationPrefs: {
            applications: true,
            messages: true,
            teams: true,
            organizations: true,
            tournaments: true,
            platform: true,
            security: true,
            verification: true,
          },
        },
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users.`);

  const playerUsers = users.filter((u) => u.role === 'player');
  const organizerUsers = users.filter((u) => u.role === 'organizer');

  // 4. Seed Player Profiles
  console.log('🎮 Creating player profiles...');
  const players = [];
  const games = ['Valorant', 'CS2', 'Apex Legends', 'Overwatch 2', 'League of Legends'];
  const roles = ['Duelist', 'IGL', 'Sentinel', 'Support', 'Entry Fragger'];
  const ranks = ['Radiant', 'Global Elite', 'Predator', 'Grandmaster', 'Challenger'];

  for (let i = 0; i < playerUsers.length; i++) {
    const u = playerUsers[i];
    if (!u) continue;

    const player = await prisma.player.create({
      data: {
        userId: u.id,
        mainGame: games[i % games.length] || 'Valorant',
        primaryRole: roles[i % roles.length] || 'Duelist',
        rank: ranks[i % ranks.length] || 'Radiant',
        verified: true,
        stats: {
          kdRatio: parseFloat((1.1 + i * 0.15).toFixed(2)),
          winRate: parseFloat((52 + i * 2.5).toFixed(2)),
          matchesPlayed: 120 + i * 35,
          mvpCount: 15 + i * 4,
        },
        achievements: [
          {
            title: 'Tournament Champion',
            description: `Won 1st place in the RosterX Summer Open.`,
            awardedAt: new Date(),
          },
          {
            title: 'MVP Award',
            description: 'Awarded MVP in local league playoffs.',
            awardedAt: new Date(),
          },
        ],
      },
    });
    players.push(player);
  }
  console.log(`✅ Created ${players.length} player profiles.`);

  // 5. Seed Organizations
  console.log('🏢 Creating organizations...');
  const orgs = [];
  const orgNames = ['Velocity Gaming', 'Global Esports', 'Entity Gaming', 'Gods Reign', 'Reckoning Esports'];

  for (let i = 0; i < organizerUsers.length; i++) {
    const u = organizerUsers[i];
    if (!u) continue;

    const game1 = games[i % games.length] || 'Valorant';
    const game2 = games[(i + 1) % games.length] || 'CS2';
    const org = await prisma.organization.create({
      data: {
        ownerId: u.id,
        name: orgNames[i] || `Org ${i}`,
        slug: (orgNames[i] || `Org ${i}`).toLowerCase().replace(/\s+/g, '-'),
        games: [game1, game2],
        description: `Leading esports organization ${orgNames[i] || `Org ${i}`} competing globally.`,
        verified: true,
        verifiedAt: new Date(),
        rosterSize: 0,
      },
    });
    orgs.push(org);
  }
  console.log(`✅ Created ${orgs.length} organizations.`);

  // 6. Seed Teams
  console.log('👥 Creating teams & rosters...');
  const teams = [];
  for (let i = 0; i < orgs.length; i++) {
    const org = orgs[i];
    if (!org) continue;

    const matchedPlayer = players[i % players.length];
    if (!matchedPlayer) continue;

    const team = await prisma.team.create({
      data: {
        organizationId: org.id,
        name: `${org.name} Alpha`,
        game: games[i % games.length] || 'Valorant',
        winRate: 65.5,
        members: [
          {
            playerId: matchedPlayer.id,
            roleOnTeam: 'IGL',
            joinedAt: new Date(),
          },
        ],
      },
    });

    // Update Player team relation
    await prisma.player.update({
      where: { id: matchedPlayer.id },
      data: { teamId: team.id },
    });

    // Update Organization roster size
    await prisma.organization.update({
      where: { id: org.id },
      data: { rosterSize: { increment: 1 } },
    });

    teams.push(team);
  }
  console.log(`✅ Created ${teams.length} teams.`);

  // 7. Seed Recruitments
  console.log('📢 Creating recruitments...');
  const recruitments = [];
  for (let i = 0; i < orgs.length; i++) {
    const org = orgs[i];
    if (!org) continue;

    const role = roles[(i + 2) % roles.length] || 'Duelist';
    const rank = ranks[i % ranks.length] || 'Radiant';
    const game = games[i % games.length] || 'Valorant';

    const rec = await prisma.recruitment.create({
      data: {
        organizationId: org.id,
        title: `Looking for top-tier ${role}`,
        game,
        roleNeeded: role,
        description: `We are looking for an experienced ${role} player to join our roster. Must be ranked ${rank} or higher.`,
        status: 'open',
      },
    });
    recruitments.push(rec);
  }
  console.log(`✅ Created ${recruitments.length} recruitment postings.`);

  // 8. Seed Applications
  console.log('📝 Creating applications...');
  for (let i = 0; i < recruitments.length; i++) {
    const rec = recruitments[i];
    if (!rec) continue;

    const applicant = players[(i + 1) % players.length];
    if (!applicant) continue;

    await prisma.application.create({
      data: {
        recruitmentId: rec.id,
        organizationId: rec.organizationId,
        playerId: applicant.id,
        message: `Hello! I am a highly motivated player looking to prove myself in the competitive scene. I match your requirements perfectly.`,
        status: i % 3 === 0 ? 'accepted' : i % 3 === 1 ? 'rejected' : 'pending',
        decidedAt: i % 3 !== 2 ? new Date() : null,
      },
    });
  }
  console.log('✅ Created applications.');

  // 9. Seed Chat Threads and Messages
  console.log('💬 Creating chat threads & messages...');
  for (let i = 0; i < 3; i++) {
    const playerUser = playerUsers[i];
    const organizerUser = organizerUsers[i];
    if (!playerUser || !organizerUser) continue;

    const thread = await prisma.chatThread.create({
      data: {
        participantIds: [playerUser.id, organizerUser.id],
      },
    });

    // Send messages back and forth
    await prisma.chatMessage.create({
      data: {
        threadId: thread.id,
        senderId: playerUser.id,
        text: `Hey, I am interested in joining your team! Let me know if we can schedule a trial.`,
        readByIds: [playerUser.id],
      },
    });

    const m2 = await prisma.chatMessage.create({
      data: {
        threadId: thread.id,
        senderId: organizerUser.id,
        text: `Hi! Thanks for reaching out. Yes, we are conducting trials this weekend. Can you share your VODs?`,
        readByIds: [organizerUser.id, playerUser.id],
      },
    });

    // Update last message
    await prisma.chatThread.update({
      where: { id: thread.id },
      data: { lastMessageId: m2.id },
    });
  }
  console.log('✅ Created chat threads & messages.');

  // 10. Seed Notifications
  console.log('🔔 Creating notifications...');
  const categories: ('applications' | 'messages' | 'teams' | 'organizations' | 'tournaments' | 'platform' | 'security' | 'verification')[] = [
    'applications',
    'messages',
    'teams',
    'organizations',
    'tournaments',
    'platform',
    'security',
    'verification',
  ];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (!user) continue;

    const cat = categories[i % categories.length] || 'platform';
    await prisma.notification.create({
      data: {
        userId: user.id,
        category: cat,
        title: `Welcome to RosterX!`,
        body: `Hi ${user.displayName}, we are excited to have you on RosterX. Start exploring players and organizations now!`,
        read: false,
      },
    });
  }
  console.log('✅ Created notifications.');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
