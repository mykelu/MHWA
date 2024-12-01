import { UserRole, RolePermissions } from '../types/auth';

const rolePermissions: Record<UserRole, RolePermissions> = {
  minor: {
    canAccessTherapy: true,
    canAccessChat: true,
    canAccessAssessments: true,
    canModerateContent: false,
    canManageUsers: false,
    canManageSystem: false,
  },
  adult: {
    canAccessTherapy: true,
    canAccessChat: true,
    canAccessAssessments: true,
    canModerateContent: false,
    canManageUsers: false,
    canManageSystem: false,
  },
  therapist: {
    canAccessTherapy: true,
    canAccessChat: true,
    canAccessAssessments: true,
    canModerateContent: false,
    canManageUsers: false,
    canManageSystem: false,
  },
  support: {
    canAccessTherapy: false,
    canAccessChat: true,
    canAccessAssessments: false,
    canModerateContent: true,
    canManageUsers: false,
    canManageSystem: false,
  },
  moderator: {
    canAccessTherapy: false,
    canAccessChat: true,
    canAccessAssessments: false,
    canModerateContent: true,
    canManageUsers: false,
    canManageSystem: false,
  },
  admin: {
    canAccessTherapy: true,
    canAccessChat: true,
    canAccessAssessments: true,
    canModerateContent: true,
    canManageUsers: true,
    canManageSystem: true,
  },
  superadmin: {
    canAccessTherapy: true,
    canAccessChat: true,
    canAccessAssessments: true,
    canModerateContent: true,
    canManageUsers: true,
    canManageSystem: true,
  },
};

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[role][permission];
}

export function getRolePermissions(role: UserRole): RolePermissions {
  return rolePermissions[role];
}