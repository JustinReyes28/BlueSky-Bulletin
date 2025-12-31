import { z } from 'zod';

export const coordinateSchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
});

export const locationSchema = z.object({
    name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s,.-]+$/),
});

export const insightRequestSchema = z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    locationName: z.string().min(1).max(100),
});
