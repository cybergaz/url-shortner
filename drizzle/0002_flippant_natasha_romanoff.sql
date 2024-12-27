CREATE TABLE "redirect_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_url_id" integer,
	"user_agent" varchar(255),
	"ip_address" "inet",
	"os_type" varchar(50),
	"device_type" varchar(50),
	"geolocation" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "topic_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic" varchar(50),
	"total_clicks" integer DEFAULT 0,
	"unique_users" integer DEFAULT 0,
	"clicks_by_date" jsonb,
	"urls" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "url_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_url_id" integer,
	"total_clicks" integer DEFAULT 0,
	"unique_users" integer DEFAULT 0,
	"clicks_by_date" jsonb,
	"os_type" jsonb,
	"device_type" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"url_creation_count" integer DEFAULT 0,
	"last_reset" timestamp DEFAULT now(),
	"reset_interval" varchar(50) DEFAULT '1 day'
);
--> statement-breakpoint
CREATE TABLE "short_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"long_url" text NOT NULL,
	"short_url" varchar(255) NOT NULL,
	"custom_alias" varchar(255),
	"topic" varchar(50),
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "short_urls_short_url_unique" UNIQUE("short_url")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "redirect_logs" ADD CONSTRAINT "redirect_logs_short_url_id_short_urls_id_fk" FOREIGN KEY ("short_url_id") REFERENCES "public"."short_urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "url_analytics" ADD CONSTRAINT "url_analytics_short_url_id_short_urls_id_fk" FOREIGN KEY ("short_url_id") REFERENCES "public"."short_urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_limits" ADD CONSTRAINT "rate_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_urls" ADD CONSTRAINT "short_urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;