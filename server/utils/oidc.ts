import type { H3Event } from 'h3';

/** Claims read from the OIDC userinfo endpoint. Only standard claims are typed; the rest are provider-specific. */
export type OidcClaims = Record<string, unknown> & {
  sub: string;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  nickname?: string;
  preferred_username?: string;
};

/**
 * Split a config value into a list. Env values may arrive as non-strings after Nuxt's `destr` parsing.
 * Lists are comma separated by default because group names may contain spaces.
 */
function parseList(value: unknown, separator: RegExp = /,/): string[] {
  const items = Array.isArray(value) ? value.map(String) : String(value ?? '').split(separator);
  return items.map((item) => item.trim()).filter(Boolean);
}

/** Scopes to request. `openid` is dropped because nuxt-auth-utils always appends it itself. */
export function getOidcScopes(event?: H3Event): string[] {
  const config = useRuntimeConfig(event).oidc;
  return parseList(config.scope, /[\s,]+/).filter((scope) => scope !== 'openid');
}

/**
 * Admin is granted when the user's email is listed in NUXT_OIDC_ADMIN_EMAILS, or when the groups claim
 * contains one of NUXT_OIDC_ADMIN_GROUPS. Group matching exists for IdPs that emit groups (Authentik, Dex
 * with `org:team` from GitHub); the email list covers IdPs that don't (e.g. Google).
 */
export function resolveOidcRole(event: H3Event, claims: OidcClaims): 'ADMIN' | 'MEMBER' {
  const config = useRuntimeConfig(event).oidc;

  const adminEmails = parseList(config.adminEmails).map((email) => email.toLowerCase());
  if (claims.email && adminEmails.includes(claims.email.toLowerCase())) {
    return 'ADMIN';
  }

  const adminGroups = parseList(config.adminGroups);
  const groups = parseList(claims[String(config.groupsClaim || 'groups')]);
  if (groups.some((group) => adminGroups.includes(group))) {
    return 'ADMIN';
  }

  return 'MEMBER';
}

export function resolveOidcNickname(claims: OidcClaims, email: string): string {
  return claims.name || claims.preferred_username || claims.nickname || email.split('@')[0]!;
}
