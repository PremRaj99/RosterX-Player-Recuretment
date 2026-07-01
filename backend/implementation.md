1. Authentication & Onboarding Workflow
Workflow: A user signs up, verifies their email, and completes their specific profile (either as a player setting up their game stats, or an organizer creating their first organization).

POST /api/auth/register

Action: Creates a new User (hashes password, sets default player role).

POST /api/auth/login

Action: Authenticates user and returns a session token (JWT).

GET /api/users/me

Action: Fetches the current user's data, including UserSettings and NotificationPrefs.

PUT /api/users/me

Action: Updates user bio, settings, or display name.

POST /api/players/me

Action: Initializes the Player profile (main game, role, rank) for a newly registered user.

2. Player Hub & Discovery Page
Workflow: Players look for teams, and organizations search the player database to scout talent.

GET /api/players

Action: Lists players.

Query Params: ?game=Valorant&rank=Diamond&role=Entry (Minimal filtering).

GET /api/players/:id

Action: Fetches a single player's public profile, including PlayerStats and PlayerAchievement.

PUT /api/players/me

Action: Updates the logged-in player's stats, achievements, or current rank.

3. Organization & Team Dashboard (Organizer View)
Workflow: An organizer logs in, manages their verified organization, creates teams for different games, and adds/removes team members.

POST /api/organizations

Action: Creates a new Organization and assigns the current user as the owner.

GET /api/organizations/:slug

Action: Fetches the public page of an organization and its associated Teams.

PUT /api/organizations/:id

Action: Updates org details (logo, description). Requires owner auth.

POST /api/organizations/:id/teams

Action: Creates a new Team under the organization.

PUT /api/teams/:id/members

Action: Updates TeamMember array (adds or removes a playerId).

4. Recruitment & Application Board
Workflow: Organizers post open slots (Recruitment). Players browse this job board and submit an Application. Organizers review applications and accept/reject them.

GET /api/recruitments

Action: The global feed of open positions.

Query Params: ?status=open&game=CS2.

POST /api/organizations/:id/recruitments

Action: Creates a new Recruitment post.

POST /api/recruitments/:id/apply

Action: Creates an Application connecting the current playerId to the recruitmentId.

GET /api/organizations/:id/applications

Action: Lists all applications for the organizer's organization (grouped by pending/accepted/rejected).

PATCH /api/applications/:id

Action: Updates the ApplicationStatus (e.g., changing it from pending to accepted).

5. Inbox & Notifications (Global Layout)
Workflow: Users receive system alerts (applications accepted) and chat with each other (scouting, interview discussions).

GET /api/notifications

Action: Fetches the current user's Notification list.

PATCH /api/notifications/:id/read

Action: Marks a specific notification as read: true.

GET /api/chats

Action: Lists all ChatThreads the user is a participant in (populates lastMessage).

POST /api/chats

Action: Starts a new ChatThread by passing a list of participantIds.

GET /api/chats/:id/messages

Action: Fetches the ChatMessage history for a specific thread.

POST /api/chats/:id/messages

Action: Sends a new message in the thread. (Note: In a production esports platform, you would eventually want this bound to a WebSocket event for real-time updates).