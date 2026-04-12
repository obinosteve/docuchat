import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
 createDocumentSchema,
 listDocumentsSchema,
 documentParamsSchema,
} from '../validators/document.validator';

const router = Router();

router.use(authenticate); // All document routes require auth

/**
 * @swagger
 * /documents:
 *   get:
 *     tags: [Documents]
 *     summary: List documents
 *     description: Returns a paginated list of the authenticated user's documents.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, ready, failed]
 *     responses:
 *       200:
 *         description: Documents fetched successfully
 *       401:
 *         description: Missing or invalid bearer token
 */
router.get('/', validate(listDocumentsSchema), listDocuments );

/**
 * @swagger
 * /documents:
 *   post:
 *     tags: [Documents]
 *     summary: Create a document
 *     description: Creates a new document for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Product Requirements
 *               content:
 *                 type: string
 *                 example: This is the document body.
 *     responses:
 *       201:
 *         description: Document created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Missing or invalid bearer token
 */
router.post('/', validate(createDocumentSchema), createDocument );

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     tags: [Documents]
 *     summary: Get a document by ID
 *     description: Returns a single document belonging to the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Document fetched successfully
 *       401:
 *         description: Missing or invalid bearer token
 *       404:
 *         description: Document not found
 */
router.get('/:id', validate(documentParamsSchema), getDocument );

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     tags: [Documents]
 *     summary: Delete a document by ID
 *     description: Deletes a single document belonging to the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         description: Missing or invalid bearer token
 *       404:
 *         description: Document not found
 */
router.delete('/:id', validate(documentParamsSchema), deleteDocument );

export default router;
