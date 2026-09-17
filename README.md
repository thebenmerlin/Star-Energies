# Star Energies

Star Energies is a Next.js public website and single-administrator CMS. The public experience is server-rendered from Neon Postgres; the administration console writes structured, approved content models without exposing layout controls or database credentials.

## Stack

- Next.js 16 App Router + TypeScript
- Neon Postgres + Drizzle ORM
- Better Auth email/password sessions
- Cloudinary media storage and optimized image delivery

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and enter your own Neon, Better Auth, and Cloudinary values. `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `CLOUDINARY_API_SECRET` are server-only secrets: never prefix them with `NEXT_PUBLIC_`.

3. Create a Neon database with a pooled/serverless-compatible connection string, then apply the tracked migrations:

   ```bash
   npm run db:migrate
   ```

4. Seed the approved content. This uses deterministic upserts and does not create a user:

   ```bash
   npm run db:seed
   ```

5. Create the first administrator. The command enables signup only inside its one-off CLI process; public signup remains disabled in the application.

   ```bash
   INITIAL_ADMIN_EMAIL=owner@example.com \
   INITIAL_ADMIN_PASSWORD='use-a-long-unique-password' \
   INITIAL_ADMIN_NAME='Star Energies Administrator' \
   npm run admin:create
   ```

   Do not retain the password in a shell history, deployment configuration, or source-controlled file after bootstrap.

6. Start the application and visit `/admin/login`:

   ```bash
   npm run dev
   ```

## Database commands

```bash
npm run db:generate  # create a new migration after editing Drizzle schema
npm run db:migrate   # apply migrations
npm run db:seed      # upsert approved site content
npm run db:studio    # inspect development data with Drizzle Studio
npm run admin:create # bootstrap an administrator from environment variables
npm run lint         # TypeScript check
npm run build        # production build
```

Migrations live in `db/migrations/`; never edit a migration that has already been applied to a shared environment. Add a new migration instead.

## Authentication

Better Auth uses database-backed, HTTP-only secure sessions. `/admin/**` is redirected to `/admin/login` when no session cookie is present; all CMS mutations and admin data reads also check the administrator role on the server. There is no public registration route in the running application.

The first user is created only by `admin:create`. Additional administrators can be added later through a controlled server-side process; no client-side `isAdmin` flag grants access.

## Cloudinary media

The media library accepts JPEG, PNG, WebP, and AVIF images up to 12 MB. The server verifies actual file bytes, uploads to Cloudinary under a generated `star-energies/<category>/` public ID, then stores metadata—not image binaries—in Neon. Cloudinary serves the public delivery URL with automatic format/quality and a restrained 2400px width ceiling. Existing assets cannot be deleted while they are referenced by page content or a catalogue record.

Create a Cloudinary product environment and a restricted API key for this application. Enter its cloud name, API key, and API secret in the Cloudinary environment variables. The API secret remains on the server; uploads and deletes are signed server-side.

## Content and caching

`lib/content/` is the server-side content service boundary. Public components never query Drizzle directly. It returns published/active data only and uses tagged Next cache entries for site settings, page documents, catalogue entities, coverage, quality, and media.

Admin changes validate on the server, write through Drizzle, and revalidate the affected public tags and paths. Draft page documents remain separate from published page documents. The enquiry UI remains deliberately mock/local until Phase 6.

## Deployment

Configure every required value from `.env.example` in the production host. Use a runtime app database role with only the privileges needed by the application; keep migration/owner credentials separate. Deploy migrations before or alongside the application release, seed only the approved initial content, bootstrap the administrator once, and test login plus a real media upload before launch.

## Production checklist

- [ ] Neon production database created with a least-privilege runtime role
- [ ] Drizzle migrations applied
- [ ] Approved content seed verified
- [ ] Initial administrator created; no bootstrap password retained
- [ ] `BETTER_AUTH_SECRET` set to a unique high-entropy production value
- [ ] Cloudinary product environment and restricted API credentials configured
- [ ] Media upload, replace, and protected delete tested
- [ ] Final phone, WhatsApp, email, address, GSTIN, logo, and photography entered
- [ ] Admin login and protected routes tested
- [ ] Public cache refresh confirmed after publishing content

Do not add live Request a Quote persistence or notifications here; those belong to Phase 6.
