-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Service_published_order_idx" ON "Service"("published", "order");
