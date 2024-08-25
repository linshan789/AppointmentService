import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { initializeDatabase } from "./database/database";
import clientRoutes from "./routes/clientRoutes";
import providerRoutes from "./routes/providerRoutes";
import adminRoutes from "./routes/adminRoutes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(bodyParser.json());

initializeDatabase();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment Scheduling API",
      version: "1.0.0",
      description: "API for managing provider availability and client reservations",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// index.ts was getting too long to scroll
// Use the client, provider, and admin routes
app.use("/clients", clientRoutes);
app.use("/providers", providerRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("running");
});

