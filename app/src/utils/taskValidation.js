const { z } = require('zod');

const taskStatuses = ['todo', 'in_progress', 'done'];
const taskPriorities = ['low', 'medium', 'high'];

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(160),

  description: z.string().trim().max(2000).optional(),

  status: z.enum(taskStatuses).optional(),

  priority: z.enum(taskPriorities).optional(),

  dueDate: z.string().datetime().nullable().optional(),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),

    description: z.string().trim().max(2000).optional(),

    status: z.enum(taskStatuses).optional(),

    priority: z.enum(taskPriorities).optional(),

    dueDate: z.string().datetime().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
