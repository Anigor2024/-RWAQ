import { hasRequiredRole } from '@/lib/firebase/auth';
import type { UserRole } from '@/types';

export interface RoleCapabilities {
  canBrowseCatalog: boolean;
  canManageSubscription: boolean;
  canRequestCorporateQuote: boolean;
  canAccessAdminConsole: boolean;
}

/**
 * Computes role capabilities strictly from a verified role.
 */
export function getRoleCapabilities(
  role: UserRole | null | undefined
): RoleCapabilities {
  return {
    canBrowseCatalog: true,
    canManageSubscription: hasRequiredRole(role, 'subscriber'),
    canRequestCorporateQuote: hasRequiredRole(role, 'corporate'),
    canAccessAdminConsole: hasRequiredRole(role, 'admin'),
  };
}
