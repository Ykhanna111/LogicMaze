import { gameResults, type InsertGameResult, type GameResult } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createGameResult(result: InsertGameResult): Promise<GameResult>;
}

export class DatabaseStorage implements IStorage {
  async createGameResult(result: InsertGameResult): Promise<GameResult> {
    const [newResult] = await db.insert(gameResults).values(result).returning();
    return newResult;
  }
}

export const storage = new DatabaseStorage();
