import z from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(3, { message: "Name is required and must be longer than 3 characters" }),
});

export const overviewSchema = z.object({
  base_currency: z.string().min(1, { message: "You must select a currency" }),
});

export const createChapterSchema = z.object({
  name: z.string().min(3, { message: "Name is required and must be longer than 3 characters" }),
  division_id: z.string().min(1, { message: "You must select a division" }),
  country: z.string().min(1, { message: "You must select a country" }),
  base_currency: z.string().min(1, { message: "You must select a currency" }),
});

export const createHoSSchema = z.object({
  name: z.string().min(3, { message: "Name is required and must be longer than 3 characters" }),
  rep_partner_id: z.string().min(1, { message: "You must select a rep" }),
});

export const createGovernorSchema = z.object({
  name: z.string().min(3, { message: "Name is required and must be longer than 3 characters" }),
  hos_id: z.string().min(1, { message: "You must select HoS" }),
  rep_partner_id: z.string().min(1, { message: "You must select a rep" }),
});

export const createPresidentSchema = z.object({
  name: z.string().min(3, { message: "Name is required and must be longer than 3 characters" }),
  hos_id: z.string().min(1, { message: "You must select HoS" }),
  governor_id: z.string().min(1, { message: "You must select Governor" }),
  rep_partner_id: z.string().min(1, { message: "You must select a rep" }),
});

export const genericToolsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  division_id: z.string().optional(),
  hos_id: z.string().optional(),
  governor_id: z.string().optional(),
  country: z.string().optional(),
  base_currency: z.string().optional(),
  rep_partner_id: z.string().optional(),
  // rep: z.string().optional(),
});

export const opsAssignmentSchema = z.object({
  hos_id: z.string().min(1, "HoS is required"),
  governor_id: z.string().optional(),
  president_id: z.string().optional(),
});

export const updateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  chapter_id: z.string().min(1, "Chapter is required"),
  permission_type: z.string().min(1, "Permission is required"),
  ggp_category: z.string().min(1, "GGP Category is required"),
  custom_remission_start: z.boolean().optional(),
  remission_start_date: z.string().optional().nullable(),
  preferred_remission_day: z.string().optional().nullable(),
  // rep: z.string().optional(),
});

export const updateG20UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  chapter_id: z.string().min(1, "Chapter is required"),
  g20_category: z.string().min(1, "G20 Category is required"),
});

export const migrateUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  division_id: z.string().min(1, { message: "You must select a division" }),
  chapter_id: z.string().min(1, "Chapter is required"),
  // rep: z.string().optional(),
});

export const toolsSchemaOptions = {
  Division: createDivisionSchema,
  Chapter: createChapterSchema,
  HoS: createHoSSchema,
  Governor: createGovernorSchema,
  President: createPresidentSchema,
};

// export const createDivisionSchema = z.object({
//   name: z.string().min(3, { message: "Name is required and must be longer than 3 characters" }),
// });
