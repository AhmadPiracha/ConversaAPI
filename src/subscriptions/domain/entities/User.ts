export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly freeMessagesUsed: number,
    public readonly freeMessagesResetDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(email: string, name: string): User {
    const now = new Date();
    return new User(
      crypto.randomUUID(),
      email,
      name,
      0,
      now,
      now,
      now
    );
  }

  needsFreeMessageReset(): boolean {
    const now = new Date()
    const resetDate = new Date(this.freeMessagesResetDate)

    return now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()
  }
}
