import { RuleSet, Rule } from "@/types/rules.types";
import Card from "../card/card";

export class Rules<T extends Card> implements RuleSet<T> {
  passRules: Rule<T>[];
  receiveRules: Rule<T>[];
  type: { pass: "every" | "any"; receive: "every" | "any" };

  constructor(
    passRules: Rule<T>[] = [() => true],
    receiveRules: Rule<T>[] = [() => true],
    type: { pass: "every" | "any"; receive: "every" | "any" } = {
      pass: "every",
      receive: "every",
    },
  ) {
    this.passRules = passRules;
    this.receiveRules = receiveRules;
    this.type = type;
  }

  canPass: Rule<T> = (source, destination, card, ...extraArgs) =>
    this.type.pass === "every"
      ? this.passRules.every((rule) =>
          rule(source, destination, card, ...extraArgs),
        )
      : this.passRules.some((rule) =>
          rule(source, destination, card, ...extraArgs),
        );

  canReceive: Rule<T> = (source, destination, card, ...extraArgs) =>
    this.type.receive === "every"
      ? this.receiveRules.every((rule) =>
          rule(source, destination, card, ...extraArgs),
        )
      : this.receiveRules.some((rule) =>
          rule(source, destination, card, ...extraArgs),
        );
}
