import { openrouter } from "./openai.client.js";
import type { z } from "zod";
import type {
  DecisionsChoiceQuestion,
  DecisionsNoulQuestion,
  DecisionsScoreQuestion,
  Answers
} from "@openrouter/sdk/models";

/**
 * LLmService manages:
 * 1. System One Decision Intelligence via Jev (typesafe/jev-1.13)
 * 2. Generative text and structured JSON completions for copywriting
 */
class LLmService {
  readonly jevModel: string = process.env.JEV_MODEL || "typesafe/jev-1.13";
  readonly generativeModel: string = process.env.OPENROUTER_GENERATIVE_MODEL || "inclusionai/ling-3.1-flash";

  /**
   * Helper to strip markdown code blocks from LLM output
   */
  private cleanJsonString(raw: string): string {
    const trimmed = raw.trim();
    const codeBlockMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return codeBlockMatch && codeBlockMatch[1] ? codeBlockMatch[1].trim() : trimmed;
  }

  /**
   * Executes a System One decision request via Jev on OpenRouter
   * Fast, calibrated, parallel evaluation with zero token generation latency
   */
  async makeDecisions<
    TQuestions extends Record<string, DecisionsChoiceQuestion | DecisionsNoulQuestion | DecisionsScoreQuestion>
  >(options: {
    state: string | Record<string, any> | Array<any>;
    questions: TQuestions;
    model?: string;
  }): Promise<{ [k: string]: Answers } | null> {
    const { state, questions, model = this.jevModel } = options;

    if (!process.env.OPENROUTER_API_TOKEN) {
      console.warn("[LLmService] Missing OPENROUTER_API_TOKEN in environment variables.");
      return null;
    }

    try {
      const response = await openrouter.alpha.decisions.create({
        decisionsRequest: {
          model,
          state,
          questions
        }
      });

      if (!response || !response.answers) {
        console.warn("[LLmService] No answers received from Jev decisions router.");
        return null;
      }

      return response.answers;
    } catch (error: any) {
      console.error(`[LLmService] Error during Jev decision request: ${error.message}`);
      return null;
    }
  }

  /**
   * Generates text via chat completion (used for generative tasks like writing)
   */
  async generateText(options: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
  }): Promise<string | null> {
    const { systemPrompt, userPrompt, model = this.generativeModel } = options;

    if (!process.env.OPENROUTER_API_TOKEN) {
      console.warn("[LLmService] Missing OPENROUTER_API_TOKEN in environment variables.");
      return null;
    }

    try {
      const response = await openrouter.chat.send({
        chatRequest: {
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        }
      });

      if ("choices" in response && Array.isArray(response.choices) && response.choices.length > 0) {
        const choice = response.choices[0];
        if (!choice) return null;

        const content = choice.message.content;
        if (typeof content === "string") {
          return content;
        }

        if (Array.isArray(content)) {
          return content
            .map((item) =>
              typeof item === "object" && item !== null && "text" in item ? String((item as any).text) : ""
            )
            .join("");
        }
      }

      return null;
    } catch (error: any) {
      console.error(`[LLmService] Error during text generation: ${error.message}`);
      return null;
    }
  }

  /**
   * Generates structured JSON from generative models with Zod validation
   */
  async generateJson<T>(options: {
    systemPrompt: string;
    userPrompt: string;
    schema?: z.ZodType<T>;
    model?: string;
  }): Promise<T | null> {
    const { systemPrompt, userPrompt, schema, model = this.generativeModel } = options;

    if (!process.env.OPENROUTER_API_TOKEN) {
      console.warn("[LLmService] Missing OPENROUTER_API_TOKEN in environment variables.");
      return null;
    }

    try {
      const response = await openrouter.chat.send({
        chatRequest: {
          model,
          responseFormat: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        }
      });

      if (!("choices" in response) || !Array.isArray(response.choices) || response.choices.length === 0) {
        console.warn("[LLmService] Empty choices received from OpenRouter.");
        return null;
      }

      const choice = response.choices[0];
      if (!choice) return null;

      const rawContent =
        typeof choice.message.content === "string"
          ? choice.message.content
          : Array.isArray(choice.message.content)
            ? choice.message.content
                .map((item) =>
                  typeof item === "object" && item !== null && "text" in item ? String((item as any).text) : ""
                )
                .join("")
            : null;

      if (!rawContent) {
        console.warn("[LLmService] Received null content from model choice.");
        return null;
      }

      const cleanedJson = this.cleanJsonString(rawContent);
      let parsedData: any;
      try {
        parsedData = JSON.parse(cleanedJson);
      } catch (parseError: any) {
        console.warn(`[LLmService] Failed to parse model output as JSON: ${parseError.message}`);
        return null;
      }

      if (schema) {
        const validation = schema.safeParse(parsedData);
        if (!validation.success) {
          console.warn("[LLmService] Zod schema validation failed on LLM output:", validation.error.format());
          return null;
        }
        return validation.data;
      }

      return parsedData as T;
    } catch (error: any) {
      console.error(`[LLmService] Error during JSON generation: ${error.message}`);
      return null;
    }
  }

  /**
   * Preserved legacy prototype to maintain backward compatibility
   */
  async llmService() {
    try {
      const decision = await openrouter.alpha.decisions.create({
        decisionsRequest: {
          model: this.jevModel,
          state: "Help! My payouts have been failing for 3 days.",
          questions: {
            is_urgent: {
              type: "noul",
              instructions: "Does this message convey urgency?",
              criteria: {
                true: "Explicitly time-sensitive",
                false: "No urgency expressed"
              }
            },
            department: {
              type: "choice",
              instructions: "Which team should handle this?",
              criteria: {
                billing: "Payments, invoicing, refunds",
                technical: "Bugs, outages, integrations",
                sales: "Pricing, upgrades, new accounts"
              }
            },
            frustration: {
              type: "score",
              instructions: "How frustrated is the customer?",
              criteria: ["Calm", "Frustrated", "Very angry"]
            }
          }
        }
      });
      return decision;
    } catch (err: any) {
      console.error(`[LLmService] Error in legacy llmService: ${err.message}`);
      return null;
    }
  }
}

export default new LLmService();
