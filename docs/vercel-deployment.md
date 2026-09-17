# Vercel deployment

The application is configured for Vercel’s Next.js runtime. `vercel.json` uses the committed lockfile through `npm ci`, runs `npm run build`, and `package.json` pins Vercel to Node.js 22.x.

## 1. Create the project

1. Import `thebenmerlin/Star-Energies` into Vercel.
2. Keep the repository root as the project root. Vercel will detect Next.js from `vercel.json`.
3. Leave the Output Directory blank. This is a server-rendered Next.js application, not a static export.
4. Set the production branch to `main`.

## 2. Configure production environment variables

Add these in Vercel → Project → Settings → Environment Variables before the first production deployment.

| Variable | Production value |
| --- | --- |
| `DATABASE_URL` | Neon pooled/serverless connection string for the runtime database role. |
| `BETTER_AUTH_SECRET` | Unique high-entropy secret. |
| `BETTER_AUTH_URL` | Canonical HTTPS production URL, with no trailing slash. |
| `NEXT_PUBLIC_APP_URL` | The same canonical HTTPS production URL. This is public by design. |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Stable random 32-byte base64 value. Keep it unchanged across deployments. |
| `CLOUDINARY_CLOUD_NAME` | Star Energies Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret; server-side only. |
| `RESEND_API_KEY` | Resend API key, when email notification is enabled. |
| `RESEND_FROM_EMAIL` | Verified Resend sender, e.g. `Star Energies <enquiries@example.com>`. |

Never add `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, `CLOUDINARY_API_SECRET`, or `RESEND_API_KEY` with a `NEXT_PUBLIC_` prefix.

For Preview deployments, copy the Neon/Cloudinary values only when the preview needs CMS or media testing. Keep the production auth URLs canonical unless a dedicated preview domain and corresponding Better Auth configuration have been deliberately set up; previews do not need to become an alternate production admin surface.

## 3. Prepare Neon before the first production request

Run these from a trusted workstation or controlled CI job using the production Neon connection string. Apply migrations with a migration-capable role; use a least-privilege runtime role in Vercel afterward.

```bash
npm ci
npm run db:migrate
npm run db:seed

INITIAL_ADMIN_EMAIL=owner@example.com \
INITIAL_ADMIN_PASSWORD='use-a-unique-long-password' \
INITIAL_ADMIN_NAME='Star Energies Administrator' \
npm run admin:create
```

The seed has deterministic content upserts and does not create sample enquiries. The administrator bootstrap is a one-time process: do not retain its password in Vercel, shell history, source control, or shared documentation.

## 4. Cloudinary uploads on Vercel

The admin media library uses a signed browser-to-Cloudinary upload flow. The browser receives only a short-lived signature, Cloudinary cloud name, and API key after server-side admin authorization. It never receives the API secret.

This avoids Vercel Function request-body limits while preserving the 12 MB image limit. After Cloudinary receives an image, the trusted Next.js route verifies the exact folder, image format, size, and metadata before adding the asset reference to Neon. The approved formats are JPEG, PNG, WebP, and AVIF.

Cloudinary assets are organised below `star-energies/<category>/`. The Cloudinary product environment must allow signed image uploads from the production domain.

## 5. Deploy and verify

Vercel runs the committed build command automatically after a push to `main`. Before assigning a custom domain, verify:

1. `/`, `/contact`, and all public routes render with published content.
2. `/admin` redirects to `/admin/login` while signed out; login and logout work on the canonical HTTPS domain.
3. A content change publishes and revalidates the affected public route.
4. Upload, select, replace, and safely delete a small Cloudinary image from the media library.
5. Submit a minimal quote enquiry, confirm it is stored as **New**, then add a note, change its status, and archive it.
6. Confirm the Resend notification and optional customer acknowledgement when email is configured. An email-provider failure must still leave the enquiry visible in the admin console.

After Vercel assigns the final domain, ensure both `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` use that exact HTTPS origin, then redeploy. Also configure that domain in Cloudinary and Resend where their account setup requires it.
