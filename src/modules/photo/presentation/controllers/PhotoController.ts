/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, Router, NextFunction } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";
import path from "path";

// Extend the Request interface to include the 'file' property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const prisma = new PrismaClient();
const router = Router();
const upload = multer({ dest: "uploads/" });

// Middleware for handling validation errors
const validate =
  (
    validations: {
      run: (
        req: Request
      ) => Promise<{ isEmpty: () => boolean; array: () => any[] }>;
    }[]
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
      }
    }
    next();
  };

router.post(
  "/upload",
  upload.single("photo"),
  validate([body("userId").isInt().withMessage("userId must be an integer")]),
  async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Photo is required" });
        return;
      }
      const { userId } = req.body;
      const photo = await prisma.photo.create({
        data: {
          userId: parseInt(userId, 10).toString(),
          uploadedAt: req.file.path,
          url: req.file.path, // Assuming the file path is used as the URL
        },
      });
      res.status(201).json(photo);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get photo by ID
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("Photo ID must be an integer")]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const photo = await prisma.photo.findUnique({ where: { id } });

      if (!photo) {
        res.status(404).json({ error: "Photo not found" });
        return;
      }

      res.json(photo);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
