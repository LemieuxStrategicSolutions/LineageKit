import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contributions = sqliteTable("contributions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  relationship: text("relationship").notNull().default(""),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  credibility: text("credibility").notNull().default("unreviewed"),
  screeningSummary: text("screening_summary").notNull().default(""),
  privacyFlags: text("privacy_flags").notNull().default(""),
  recommendation: text("recommendation").notNull().default(""),
  reviewerNotes: text("reviewer_notes").notNull().default(""),
  reviewedAt: text("reviewed_at"),
  reviewedBy: text("reviewed_by").notNull().default(""),
  requesterHash: text("requester_hash").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contributionFiles = sqliteTable("contribution_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contributionId: text("contribution_id").notNull(),
  objectKey: text("object_key").notNull(),
  originalName: text("original_name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
