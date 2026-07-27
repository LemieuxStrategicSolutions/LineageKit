ALTER TABLE `contributions` ADD `credibility` text DEFAULT 'unreviewed' NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `screening_summary` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `privacy_flags` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `recommendation` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `reviewer_notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `reviewed_at` text;--> statement-breakpoint
ALTER TABLE `contributions` ADD `reviewed_by` text DEFAULT '' NOT NULL;