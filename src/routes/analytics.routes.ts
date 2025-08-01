import { Router } from "express";

import { getLoanDsaActivityStats, getPlanPopularityStats, getTopUsersStats } from "../controllers/analytics.controller";

const analyticsRoutes = Router();

analyticsRoutes.get("/dsa-activity-stats", getLoanDsaActivityStats);
analyticsRoutes.get("/plan-popularity", getPlanPopularityStats)
analyticsRoutes.get("/top-users", getTopUsersStats)

export default analyticsRoutes;