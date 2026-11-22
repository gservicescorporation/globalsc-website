import "reflect-metadata"
import { DataSource } from "typeorm"
import { Payment } from "@/entities/Payment"
import {
	AdminUserEntity,
	EventEntity,
	HeroSlideEntity,
	SiteContentEntity,
} from "@/entities/schemas"
import { MEDIATION_ENTITIES } from "@/entities/mediation"

const dataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	ssl:
		process.env.DATABASE_SSL === "true"
			? { rejectUnauthorized: false }
			: undefined,
	entities: [Payment, EventEntity, HeroSlideEntity, AdminUserEntity, SiteContentEntity, ...MEDIATION_ENTITIES],
	migrations: [],
	synchronize: true,
	logging: process.env.NODE_ENV !== "production" ? ["error"] : false,
})

export default dataSource
