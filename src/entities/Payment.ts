import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
	BeforeInsert,
} from "typeorm"
import { v4 as uuidv4 } from "uuid"

export enum PaymentStatus {
	PENDING = "PENDING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	CANCELLED = "CANCELLED",
	ERROR = "ERROR",
}

@Entity("payments")
export class Payment {
	@PrimaryColumn("uuid")
	id!: string

	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = uuidv4()
		}
	}

	@Index({ unique: true })
	@Column()
	merchantTransactionId!: string

	@Column("decimal", { precision: 12, scale: 2 })
	amount!: number

	@Column({ length: 3 })
	currency!: string

	@Column()
	paymentMethod!: string

	@Column({
		type: "enum",
		enum: PaymentStatus,
		default: PaymentStatus.PENDING,
	})
	status!: PaymentStatus

	@Column({ nullable: true })
	ekwanzaTransactionId?: string

	@Column("decimal", { precision: 12, scale: 2, nullable: true })
	paidAmount?: number

	@Column({ nullable: true })
	referenceType?: "GPO" | "REF"

	@Column({ nullable: true })
	referenceNumber?: string

	@Column({ nullable: true })
	entity?: string

	@Column({ type: "timestamp", nullable: true })
	dueDate?: Date

	@Column({ nullable: true })
	eventId?: string

	@Column({ nullable: true })
	failureReason?: string

	@Column({ nullable: true })
	providerCode?: string

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
