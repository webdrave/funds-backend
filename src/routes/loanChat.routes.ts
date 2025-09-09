import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  postMessage,
  getMessagesByLoan,
  markLoanMessagesRead,
} from "../controllers/loanChat.controller";
import { authenticate } from "../middleware"; // use your existing auth middleware

const router = Router();

// Create a message (authenticated or not depending on your policy)
router.post("/", authenticate, expressAsyncHandler(postMessage));

// Get messages for a loan (anyone with loan access)
router.get("/:loanId", authenticate, expressAsyncHandler(getMessagesByLoan));

// Mark all messages as read by current user
router.patch("/:loanId/mark-read", authenticate, expressAsyncHandler(markLoanMessagesRead));

export default router;
