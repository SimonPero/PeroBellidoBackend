import { Router } from "express";

const loggerRouter = Router();

// Ruta para probar el registro de eventos
loggerRouter.get("/", (req, res) => {
  // Registra mensajes de diferentes niveles de registro
  req.logger.debug("This is a debug message");
  req.logger.info("This is an info message");
  req.logger.warn("This is a warn message");
  req.logger.error("This is an error message");

  // Envía una respuesta al cliente
  res.send("Logger Test Done. Check your Server Console!");
});

export default loggerRouter;
