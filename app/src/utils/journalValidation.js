const { z } = require('zod');

const moods = ['great', 'good', 'neutral', 'bad'];

const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .transform((tag) => tag.toLowerCase());

const createJournalSchema = z.object({
  title: z.string().trim().min(1).max(160),

  content: z.string().trim().min(1).max(10000),

  mood: z.enum(moods).optional(),

  entryDate: z.string().datetime().optional(),

  tags: z.array(tagSchema).max(10).optional(),
});

const updateJournalSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),

    content: z.string().trim().min(1).max(10000).optional(),

    mood: z.enum(moods).optional(),

    entryDate: z.string().datetime().optional(),

    tags: z.array(tagSchema).max(10).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

module.exports = {
  createJournalSchema,
  updateJournalSchema,
};
