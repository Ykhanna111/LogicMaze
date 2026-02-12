import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  completedAt: timestamp("completed_at").defaultNow(),
  movesCount: integer("moves_count").notNull(),
  isWin: boolean("is_win").notNull(),
});

// === BASE SCHEMAS ===
export const insertGameResultSchema = createInsertSchema(gameResults).omit({ id: true, completedAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
