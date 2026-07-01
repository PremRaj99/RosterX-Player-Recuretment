1. Public Routes (Unauthenticated & Root Pages)
These pages are accessible to anyone. They serve as the entry points for the platform and showcase public data.

/ (Landing Page)

Functionality: Explains the platform, shows featured organizations or recent open recruitments.

API Calls: GET /api/recruitments?limit=5 (optional, for preview).

/login & /register

Functionality: User authentication and account creation.

API Calls: POST /api/auth/login, POST /api/auth/register.

/board (Recruitment Board)

Functionality: Global feed where anyone can browse open team slots.

API Calls: GET /api/recruitments.

/player/:id (Public Player Profile)

Functionality: Shows a player's stats, rank, and achievements to the public.

API Calls: GET /api/players/:id.

/org/:slug (Public Organization Page)

Functionality: Shows an organization's details, active teams, and roster.

API Calls: GET /api/organizations/:slug.

2. Protected Routes (All Authenticated Users)
Requires a valid session/JWT. Both Players and Organizers access these to manage their accounts and communicate.

/onboarding

Functionality: Forces new users to complete their profile before accessing the rest of the app.

API Calls: POST /api/players/me (if player) or POST /api/organizations (if organizer).

/settings

Functionality: Update password, bio, and notification preferences (NotificationPrefs).

API Calls: GET /api/users/me, PUT /api/users/me.

/inbox

Functionality: The messaging interface. List of threads on the left, active chat on the right.

API Calls: GET /api/chats, GET /api/chats/:id/messages, POST /api/chats/:id/messages.

/notifications (Can be a dropdown menu or dedicated page)

Functionality: View system alerts (e.g., "Your application was accepted!").

API Calls: GET /api/notifications, PATCH /api/notifications/:id/read.

3. Player-Only Routes
Requires authentication + role === 'player'.

/dashboard (Player Hub)

Functionality: The player's home base. Shows their current stats, active team (if any), and the status of their pending applications.

API Calls: GET /api/users/me (with playerProfile included).

/profile/edit

Functionality: Update main game, rank, roles, and achievements.

API Calls: PUT /api/players/me.

/board/:id/apply (Modal or Page)

Functionality: The form a player submits to apply for a specific recruitment post.

API Calls: POST /api/recruitments/:id/apply.

4. Organizer-Only Routes
Requires authentication + role === 'organizer'.

/org/dashboard

Functionality: Overview of the organization, total members, and quick actions.

API Calls: GET /api/users/me (with organizations included).

/org/teams/manage

Functionality: Create new teams for different games and add/remove players (TeamMember).

API Calls: POST /api/organizations/:id/teams, PUT /api/teams/:id/members.

/org/recruitments/manage

Functionality: Create, edit, or close open recruitment postings.

API Calls: POST /api/organizations/:id/recruitments.

/org/applications

Functionality: A Kanban-style or list view of players who have applied to the org's recruitments. Organizers can accept/reject here.

API Calls: GET /api/organizations/:id/applications, PATCH /api/applications/:id.

/scout (Player Discovery)

Functionality: A search interface to find free agents based on game, rank, or role.

API Calls: GET /api/players?game=...&rank=...