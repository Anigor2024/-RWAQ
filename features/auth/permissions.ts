import type { UserRole } from '@/types';

export type Capability =
  | 'catalog:browse'
  | 'subscription:manage_own'
  | 'corporate:quote_request'
  | 'admin:catalog_manage'
  | 'admin:inventory_manage'
  | 'admin:orders_manage'
  | 'admin:settings_manage';

/**
 * Explicit capability matrix per role.
 * Roles are domain-specific rather than a simplistic numerical ladder:
 * - customer: retail catalog & purchasing
 * - subscriber: retail catalog + recurring subscription management
 * - corporate: retail catalog + B2B corporate quotation workflow (does not inherit subscriber)
 * - admin: explicit house operations & administrative governance
 */
export const ROLE_CAPABILITY_MATRIX: Record<UserRole, readonly Capability[]> = {
  customer: ['catalog:browse'],
  subscriber: ['catalog:browse', 'subscription:manage_own'],
  corporate: ['catalog:browse', 'corporate:quote_request'],
  admin: [
    'catalog:browse',
    'subscription:manage_own',
    'corporate:quote_request',
    'admin:catalog_manage',
    'admin:inventory_manage',
    'admin:orders_manage',
    'admin:settings_manage',
  ],
};

export function hasCapability(
  verifiedRole: UserRole | null | undefined,
  capability: Capability
): boolean {
  if (!verifiedRole) {
    return capability === 'catalog:browse';
  }
  const granted = ROLE_CAPABILITY_MATRIX[verifiedRole];
  return granted ? granted.includes(capability) : false;
}

export interface RoleCapabilities {
  canBrowseCatalog: boolean;
  canManageSubscription: boolean;
  canRequestCorporateQuote: boolean;
  canAccessAdminConsole: boolean;
}

/**
 * Computes role capabilities strictly from a verified backend role.
 * Demo Mode personas must never be passed into authorization checks for privileged operations.
 */
export function getRoleCapabilities(
  verifiedRole: UserRole | null | undefined
): RoleCapabilities {
  return {
    canBrowseCatalog: hasCapability(verifiedRole, 'catalog:browse'),
    canManageSubscription: hasCapability(
      verifiedRole,
      'subscription:manage_own'
    ),
    canRequestCorporateQuote: hasCapability(
      verifiedRole,
      'corporate:quote_request'
    ),
    canAccessAdminConsole: hasCapability(
      verifiedRole,
      'admin:catalog_manage'
    ),
  };
}
