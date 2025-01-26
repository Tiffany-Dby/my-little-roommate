import express from "express";
import initMiddlewares from "./middlewares/init.middleware";
import initRoutes from "./routes/init.routes";
import { errorManager } from "./middlewares/errorManager.middleware";

const app = express();

initMiddlewares(app);
initRoutes(app);

app.use(errorManager);

export default app;
// Routes
/*
app.get("/", (req, res) => {
  throw new Error(
    "Il n'y a rien d'implémenté dans cette route, à vous de jouer !"
  );
});
*/

// Middleware de gestion des erreurs (à vous de le personnaliser pour qu'il soit réutilisable, pensez aux classes d'erreurs)
/*
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    errorCode: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "An unexpected error occurred",
  });
});
*/
