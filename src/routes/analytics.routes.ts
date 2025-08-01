import { Router } from "express";

import { getLoanDsaActivityStats, getPlanPopularityStats, getTopUsersStats } from "../controllers/analytics.controller";
import { authenticate, requireSuperadmin } from "../middleware";

const analyticsRoutes = Router();

analyticsRoutes.get("/dsa-activity-stats",authenticate,requireSuperadmin, getLoanDsaActivityStats);
analyticsRoutes.get("/plan-popularity",authenticate,requireSuperadmin, getPlanPopularityStats)
analyticsRoutes.get("/top-users", authenticate, requireSuperadmin, getTopUsersStats)

export default analyticsRoutes;