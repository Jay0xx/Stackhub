"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";
import { submitTool } from "@/lib/data";

/* ─── Schema ──────────────────────────────────────────────────────────────── */

const TOOL_CATEGORIES = CATEGORIES.filter((c) => c !== "All") as [
  string,
  ...string[],
];

const schema = z.object({
  name: z
    .string()
    .min(1, "Tool name is required")
    .max(80, "Name must be 80 characters or fewer"),
  githubUrl: z
    .string()
    .min(1, "GitHub URL is required")
    .url("Must be a valid URL")
    .refine(
      (v) => v.includes("github.com"),
      "Must be a github.com URL",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be 200 characters or fewer"),
  category: z
    .string({ error: "Please select a category" })
    .refine(
      (v) => TOOL_CATEGORIES.includes(v),
      "Please select a valid category",
    ),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ─── Component ───────────────────────────────────────────────────────────── */

export function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      githubUrl: "",
      description: "",
      category: undefined,
      tags: "",
    },
  });

  const descriptionLength = watch("description")?.length ?? 0;

  async function onSubmit(data: FormValues) {
    setServerError(null);

    // Build a URL-safe slug from the tool name
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const tags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : null;

    const { error } = await submitTool({
      name: data.name,
      slug,
      description: data.description,
      category: data.category,
      github_url: data.githubUrl,
      tags,
    });

    if (error) {
      setServerError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return <SuccessState onReset={() => { reset(); setSubmitted(false); }} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8"
    >
      {/* Tool Name */}
      <Field
        label="Tool Name"
        htmlFor="name"
        error={errors.name?.message}
        required
      >
        <Input
          id="name"
          type="text"
          placeholder="e.g. Hardhat"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass(!!errors.name)}
          {...register("name")}
        />
      </Field>

      {/* GitHub URL */}
      <Field
        label="GitHub URL"
        htmlFor="githubUrl"
        error={errors.githubUrl?.message}
        required
      >
        <Input
          id="githubUrl"
          type="url"
          placeholder="https://github.com/org/repo"
          aria-invalid={!!errors.githubUrl}
          aria-describedby={errors.githubUrl ? "githubUrl-error" : undefined}
          className={inputClass(!!errors.githubUrl)}
          {...register("githubUrl")}
        />
      </Field>

      {/* Short Description */}
      <Field
        label="Short Description"
        htmlFor="description"
        hint={`${descriptionLength} / 200`}
        error={errors.description?.message}
        required
      >
        <Textarea
          id="description"
          rows={3}
          placeholder="A concise one or two sentence description of the tool and what problem it solves."
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          className={cn(
            inputClass(!!errors.description),
            "resize-none leading-relaxed",
          )}
          {...register("description")}
        />
      </Field>

      {/* Category */}
      <Field
        label="Category"
        htmlFor="category-trigger"
        error={errors.category?.message}
        required
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger
                id="category-trigger"
                aria-invalid={!!errors.category}
                aria-describedby={
                  errors.category ? "category-error" : undefined
                }
                className={cn(inputClass(!!errors.category), "w-full h-11")}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {TOOL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      {/* Tags (optional) */}
      <Field
        label="Tags"
        htmlFor="tags"
        hint="Optional — comma separated, e.g. Solidity, TypeScript, Testing"
        error={errors.tags?.message}
      >
        <Input
          id="tags"
          type="text"
          placeholder="Solidity, TypeScript, Testing"
          aria-invalid={!!errors.tags}
          className={inputClass(!!errors.tags)}
          {...register("tags")}
        />
      </Field>

      {/* Submit */}
      <div className="border-t border-border pt-8 flex flex-col gap-4">
        {serverError && (
          <p className="flex items-center gap-1.5 text-xs text-foreground">
            <AlertIcon />
            {serverError}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-12 w-full rounded-lg bg-foreground text-background text-[15px] font-medium tracking-tight transition-opacity hover:opacity-80 disabled:opacity-40",
          )}
        >
          {isSubmitting ? "Submitting…" : "Submit Tool"}
        </Button>
      </div>
    </form>
  );
}

/* ─── Success state ───────────────────────────────────────────────────────── */

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-foreground">
        <CheckIcon />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          Thank you!
        </h2>
        <p className="text-base text-muted-foreground">
          Your tool has been submitted for review.
        </p>
        <p className="text-sm text-muted-foreground">
          It will appear on StackHub once approved. You can contact us if you
          have any questions.
        </p>
      </div>

      <Button
        type="button"
        onClick={onReset}
        variant="outline"
        className="h-10 rounded-lg border-border px-6 text-sm font-medium text-foreground hover:bg-secondary"
      >
        Submit Another Tool
      </Button>
    </div>
  );
}

/* ─── Field wrapper ───────────────────────────────────────────────────────── */

interface FieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Field({ label, htmlFor, children, error, hint, required }: FieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-0.5 text-muted-foreground" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {hint && (
          <span
            id={hintId}
            className="text-[11px] tabular-nums text-muted-foreground"
          >
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-foreground"
        >
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function inputClass(hasError: boolean) {
  return cn(
    "h-11 rounded-lg border-border bg-background text-[15px] text-foreground",
    hasError && "border-foreground ring-1 ring-foreground/20",
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
