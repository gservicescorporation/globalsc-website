import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { Payment } from "@/entities/Payment"

dotenv.config()

const dataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	// ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
	entities: [Payment],
	migrations: [],
	synchronize: true,
	logging: true,
})

export default dataSource
