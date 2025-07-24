export class Chat {
  constructor(
    public readonly id: string,
    public readonly question: string,
    public readonly answer: string,
    public readonly tokens: number,
    public readonly userId: string,
    public readonly bundleId?: string,
    public readonly isFreeMessage: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(
    question: string,
    answer: string,
    tokens: number,
    userId: string,
    bundleId?: string,
    isFreeMessage = false,
  ): Omit<Chat, "id" | "createdAt"> {
    return {
      question,
      answer,
      tokens,
      userId,
      bundleId,
      isFreeMessage,
    }
  }
}
