export class EvaluationContext {
  constructor(
    public readonly userId?: string,
    public readonly attributes: Record<string, any> = {}
  ) {}
}
