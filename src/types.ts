/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'STUDENT' | 'TPO' | 'HR' | 'COORDINATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  // Student specific
  cgpa?: number;
  branch?: string;
  skills?: string[];
  projects?: { title: string; link: string }[];
  isBlocked?: boolean;
  isVerified?: boolean;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
}

export interface JobPosting {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string;
  minCgpa: number;
  branches: string[];
  salary: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  jobTitle: string;
  companyName: string;
  status: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' | 'ACCEPTED' | 'DECLINED';
  appliedAt: string;
  currentRound?: number;
}

export interface StudentQuery {
  id: string;
  studentId: string;
  studentName: string;
  message: string;
  department: string;
  status: 'PENDING' | 'RESOLVED';
  response?: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  studentId: string;
  companyId: string;
  companyName: string;
  scheduledAt: string;
  location: string;
  round: number; // 1, 2, 3...
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: 'JOB' | 'INTERVIEW' | 'ANNOUNCEMENT' | 'OFFER';
}

export interface PlacementStats {
  placed: number;
  total: number;
  avgPackage: number;
  highestPackage: number;
  departmentStats: { department: string; placed: number; total: number }[];
}
