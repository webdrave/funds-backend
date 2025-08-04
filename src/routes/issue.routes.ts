import { Router } from "express";
import { reportIssue, getIssues } from "../controllers/issue.controller";
import { authenticate, requireDSA, requireSuperadmin } from "../middleware";

const issueRoutes = Router();

// Report a new issue
issueRoutes.post("/", authenticate, requireDSA, reportIssue);
issueRoutes.get("/", authenticate, requireSuperadmin, getIssues);

export default issueRoutes;
