import { eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

import { db } from '~~/server/utils/db';
import type { OidcClaims } from '~~/server/utils/oidc';
import { users } from '~~/server/utils/schema';

// Build the handler per request: nuxt-auth-utils reassigns its captured `config` with `defu` on each call,
// which concatenates arrays, so a module-level handler would append another `openid` scope every request.
export default defineEventHandler((event) =>
  defineOAuthOidcEventHandler<OidcClaims>({
    config: {
      // clientId / clientSecret / openidConfig / redirectURL come from NUXT_OAUTH_OIDC_* env vars
      scope: getOidcScopes(event)
    },
    async onSuccess(event, { user: claims }) {
      const email = claims.email;
      if (!email) {
        console.error('OIDC login rejected: no email claim. Request the `email` scope.');
        return sendRedirect(event, '/login?error=oauth_failed');
      }
      if (claims.email_verified === false || claims.email_verified === 'false') {
        console.error(`OIDC login rejected: unverified email ${email}`);
        return sendRedirect(event, '/login?error=oauth_failed');
      }

      const nickname = resolveOidcNickname(claims, email);
      const role = resolveOidcRole(event, claims);

      // Users are keyed by email so accounts survive a change of identity provider
      let [dbUser] = await db.select().from(users).where(eq(users.email, email));

      if (!dbUser) {
        // Auto register
        [dbUser] = await db.insert(users).values({
          id: uuidv7(),
          email,
          nickname,
          role
        }).returning();
      } else if (dbUser.role !== role) {
        // Sync role with the IdP's groups / admin email list
        [dbUser] = await db.update(users)
          .set({ role, updatedAt: new Date() })
          .where(eq(users.id, dbUser.id))
          .returning();
      }

      await setUserSession(event, {
        user: {
          id: dbUser!.id,
          email: dbUser!.email,
          nickname: dbUser!.nickname,
          role: dbUser!.role
        }
      });

      return sendRedirect(event, '/');
    },
    onError(event, error) {
      console.error('OIDC login error:', error);
      return sendRedirect(event, '/login?error=oauth_failed');
    }
  })(event)
);
