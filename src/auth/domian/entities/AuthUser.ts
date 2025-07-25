import bcrypt from "bcryptjs"

export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
    public readonly isVerified: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static async create(
    email: string,
    name: string,
    password: string,
  ): Promise<{
    email: string
    name: string
    passwordHash: string
    isVerified: boolean
  }> {
    const passwordHash = await bcrypt.hash(password, 12)

    return {
      email,
      name,
      passwordHash,
      isVerified: false,
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash)
  }

  isActive(): boolean {
    return this.isVerified
  }
}
